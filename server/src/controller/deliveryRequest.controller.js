import { DeliveryAssignment } from "../model/deliveryAssignment.model.js";
import { DeliveryRequest } from "../model/deliveryRequest.model.js";
import { FoodDonation } from "../model/foodDonation.model.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { expireReservation } from "../services/delivery.service.js";
import { createNotifications } from "../services/notification.service.js";

const reservationMinutes = Number(process.env.RESERVATION_MINUTES || 15);

export const listDeliveryRequests = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "organization"
      ? { requester: req.user._id }
      : req.user.role === "volunteer"
        ? {
            requesterType: "organization",
            status: "pending",
            expiresAt: { $gt: new Date() },
          }
        : {};
  const requests = await DeliveryRequest.find(filter)
    .populate(
      "donation requester",
      "foodName foodType pickupLocation expiresAt organizationName location",
    )
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, requests, "Delivery requests fetched successfully"),
    );
});

const createAssignment = (donation, organization, volunteer, deliveryMode) => ({
  donation: donation._id,
  organization: organization._id,
  volunteer: volunteer?._id,
  deliveryMode,
  pickupLocation: donation.pickupLocation,
  deliveryLocation: organization.location,
  status: "assigned",
});

export const createDeliveryRequest = asyncHandler(async (req, res) => {
  const { donationId, deliveryMode = "volunteer" } = req.body;
  if (!["organization", "volunteer"].includes(deliveryMode)) {
    throw new ApiError(400, "Choose organization transport or a volunteer");
  }
  const donation = await FoodDonation.findById(donationId);
  if (!donation) throw new ApiError(404, "Donation not found");
  if (new Date(donation.expiresAt) <= new Date())
    throw new ApiError(409, "Donation has expired");

  const organization = await User.findById(req.user._id);
  // Temporary: allow organizations to request donations before verification.
  // if (!organization?.isVerified)
  //   throw new ApiError(403, "Organization must be verified");

  if (deliveryMode === "organization") {
    if (!organization.hasTransport) {
      throw new ApiError(400, "Add transport details in Settings before choosing own transport");
    }
    const claimed = await FoodDonation.findOneAndUpdate(
      { _id: donationId, status: { $in: ["available", "searching"] } },
      { status: "confirmed", $unset: { currentReservation: 1 } },
      { new: true },
    );
    if (!claimed) throw new ApiError(409, "Donation is no longer available");
    const request = await DeliveryRequest.create({
      donation: donationId,
      requester: organization._id,
      requesterType: "organization",
      hasTransport: true,
      status: "accepted",
    });
    const assignment = await DeliveryAssignment.create(
      createAssignment(
        claimed,
        organization,
        null,
        "organization",
      ),
    );
    await createNotifications([claimed.donor], {
      type: "donation_accepted",
      message: "Your donation has been accepted and assigned for delivery.",
      donation: claimed._id,
      request: request._id,
      assignment: assignment._id,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { request, assignment },
          "Donation accepted and delivery assigned",
        ),
      );
  }

  await expireReservationForDonation(donationId);
  const reservedUntil = new Date(Date.now() + reservationMinutes * 60 * 1000);
  const reserved = await FoodDonation.findOneAndUpdate(
    {
      _id: donationId,
      status: { $in: ["available", "searching"] },
      $or: [
        { "currentReservation.reservedUntil": { $exists: false } },
        { "currentReservation.reservedUntil": { $lte: new Date() } },
      ],
    },
    {
      status: "temporarily_reserved",
      currentReservation: { organization: organization._id, reservedUntil },
    },
    { new: true },
  );
  if (!reserved)
    throw new ApiError(409, "Donation is already reserved or confirmed");
  const request = await DeliveryRequest.create({
    donation: donationId,
    requester: organization._id,
    requesterType: "organization",
    hasTransport: false,
    expiresAt: reservedUntil,
  });
  await createNotifications([organization._id], {
    type: "donation_reserved",
    message: "Your donation reservation is active while a volunteer is found.",
    donation: donationId,
    request: request._id,
  });
  const volunteers = await User.find({
    role: "volunteer",
    isAvailable: true,
  }).select("_id");
  await createNotifications(
    volunteers.map((volunteer) => volunteer._id),
    {
      type: "volunteer_needed",
      message: "A nearby food pickup needs a volunteer.",
      donation: donationId,
      request: request._id,
    },
  );
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        request,
        "Donation temporarily reserved; volunteer required",
      ),
    );
});

const expireReservationForDonation = async (donationId) => {
  const donation = await FoodDonation.findOne({
    _id: donationId,
    status: "temporarily_reserved",
    "currentReservation.reservedUntil": { $lte: new Date() },
  });
  if (!donation) return;
  await DeliveryRequest.updateMany(
    {
      donation: donationId,
      status: "pending",
      expiresAt: { $lte: new Date() },
    },
    { status: "expired" },
  );
  await FoodDonation.updateOne(
    { _id: donationId },
    { status: "searching", $unset: { currentReservation: 1 } },
  );
};

export const acceptVolunteerRequest = asyncHandler(async (req, res) => {
  const request = await DeliveryRequest.findOne({
    _id: req.params.id,
    status: "pending",
    requesterType: "organization",
    expiresAt: { $gt: new Date() },
  });
  if (!request) throw new ApiError(409, "Reservation is missing or expired");
  const volunteer = await User.findOneAndUpdate(
    { _id: req.user._id, role: "volunteer", isAvailable: true },
    { isAvailable: false },
    { new: true },
  );
  if (!volunteer) throw new ApiError(409, "Volunteer is unavailable");

  const donation = await FoodDonation.findOneAndUpdate(
    {
      _id: request.donation,
      status: "temporarily_reserved",
      "currentReservation.organization": request.requester,
      "currentReservation.reservedUntil": { $gt: new Date() },
    },
    { status: "confirmed", $unset: { currentReservation: 1 } },
    { new: true },
  );
  if (!donation) {
    await User.updateOne({ _id: volunteer._id }, { isAvailable: true });
    throw new ApiError(409, "Reservation has expired or was already completed");
  }
  const accepted = await DeliveryRequest.findOneAndUpdate(
    { _id: request._id, status: "pending" },
    { status: "accepted" },
    { new: true },
  );
  const organization = await User.findById(request.requester);
  const assignment = await DeliveryAssignment.create(
    createAssignment(donation, organization, volunteer, "volunteer"),
  );
  await createNotifications([organization._id, donation.donor], {
    type: "volunteer_assigned",
    message: "A volunteer has been assigned to your food delivery.",
    donation: donation._id,
    request: accepted._id,
    assignment: assignment._id,
  });
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { request: accepted, assignment },
        "Volunteer assigned successfully",
      ),
    );
});

export const rejectVolunteerRequest = asyncHandler(async (req, res) => {
  const request = await DeliveryRequest.findOneAndUpdate(
    {
      _id: req.params.id,
      status: "pending",
      requesterType: "organization",
      expiresAt: { $gt: new Date() },
    },
    { status: "rejected" },
    { new: true },
  );
  if (!request) throw new ApiError(409, "Delivery request is missing or expired");

  await FoodDonation.findOneAndUpdate(
    {
      _id: request.donation,
      status: "temporarily_reserved",
      "currentReservation.organization": request.requester,
    },
    { status: "searching", $unset: { currentReservation: 1 } },
  );
  await createNotifications([request.requester], {
    type: "reservation_expired",
    message: "The volunteer declined this delivery request. Please choose another volunteer.",
    donation: request.donation,
    request: request._id,
  });
  res.status(200).json(new ApiResponse(200, request, "Delivery request rejected"));
});

export const expireDeliveryRequest = asyncHandler(async (req, res) => {
  const existingRequest = await DeliveryRequest.findById(req.params.id).select(
    "requester",
  );
  if (!existingRequest) throw new ApiError(404, "Delivery request not found");
  if (
    req.user.role !== "admin" &&
    !existingRequest.requester.equals(req.user._id)
  ) {
    throw new ApiError(403, "You cannot expire this reservation");
  }
  const request = await expireReservation(req.params.id);
  if (!request) throw new ApiError(409, "Reservation is not ready to expire");
  res.status(200).json(new ApiResponse(200, request, "Reservation expired"));
});
