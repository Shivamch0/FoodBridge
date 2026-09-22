import { FoodDonation } from "../model/foodDonation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { createNotifications } from "../services/notification.service.js";

export const createDonation = asyncHandler(async (req, res) => {
  const { expiresAt, preparedAt } = req.body;
  if (!expiresAt || new Date(expiresAt) <= new Date())
    throw new ApiError(400, "expiresAt must be in the future");
  if (preparedAt && new Date(preparedAt) > new Date())
    throw new ApiError(400, "preparedAt cannot be in the future");
  const uploadedImages = (req.files || []).map(
    (file) => `/uploads/${file.filename}`,
  );
  const donation = await FoodDonation.create({
    ...req.body,
    images: uploadedImages.length ? uploadedImages : req.body.images,
    donor: req.user._id,
    status: "searching",
  });
  const recipients = await User.find({
    role: { $in: ["organization", "volunteer"] },
  }).select("_id");
  await createNotifications(
    recipients.map((recipient) => recipient._id),
    {
      type: "new_food_available",
      message: `${donation.foodName} is available for pickup.`,
      donation: donation._id,
    },
  );
  res
    .status(201)
    .json(new ApiResponse(201, donation, "Donation created successfully"));
});

export const listDonations = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "donor"
      ? { donor: req.user._id }
      : { status: { $in: ["available", "searching", "temporarily_reserved"] } };
  if (
    req.user.role !== "donor" &&
    req.user.location?.coordinates?.length === 2
  ) {
    const maxDistanceKm = Number(req.query.maxDistanceKm || 20);
    filter.pickupLocation = {
      $near: {
        $geometry: req.user.location,
        $maxDistance:
          (Number.isFinite(maxDistanceKm) && maxDistanceKm > 0
            ? maxDistanceKm
            : 20) * 1000,
      },
    };
  }
  const donations = await FoodDonation.find(filter).sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, donations, "Donations fetched successfully"));
});

export const getDonation = asyncHandler(async (req, res) => {
  const donation = await FoodDonation.findById(req.params.id);
  if (!donation) throw new ApiError(404, "Donation not found");
  res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation fetched successfully"));
});

export const updateDonation = asyncHandler(async (req, res) => {
  const donation = await FoodDonation.findOne({
    _id: req.params.id,
    donor: req.user._id,
  });
  if (!donation) throw new ApiError(404, "Donation not found");
  if (!["available", "searching"].includes(donation.status))
    throw new ApiError(409, "Donation can no longer be updated");
  const editableFields = [
    "foodName",
    "foodType",
    "description",
    "quantity",
    "unit",
    "preparedAt",
    "expiresAt",
    "images",
    "pickupLocation",
    "deliveryPreference",
  ];
  for (const field of editableFields) {
    if (req.body[field] !== undefined) donation[field] = req.body[field];
  }
  if (new Date(donation.expiresAt) <= new Date())
    throw new ApiError(400, "expiresAt must be in the future");
  await donation.save();
  res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation updated successfully"));
});

export const cancelDonation = asyncHandler(async (req, res) => {
  const donation = await FoodDonation.findOneAndUpdate(
    {
      _id: req.params.id,
      donor: req.user._id,
      status: { $in: ["available", "searching", "temporarily_reserved"] },
    },
    { status: "cancelled", currentReservation: undefined },
    { new: true },
  );
  if (!donation) throw new ApiError(409, "Donation cannot be cancelled");
  res
    .status(200)
    .json(new ApiResponse(200, donation, "Donation cancelled successfully"));
});
