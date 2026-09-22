import { DeliveryAssignment } from "../model/deliveryAssignment.model.js";
import { FoodDonation } from "../model/foodDonation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { updateAssignmentStatus } from "../services/delivery.service.js";

export const listDeliveries = asyncHandler(async (req, res) => {
  let filter =
    req.user.role === "volunteer"
      ? { volunteer: req.user._id }
      : req.user.role === "organization"
        ? { organization: req.user._id }
        : {};
  if (req.user.role === "donor") {
    const donationIds = await FoodDonation.find({ donor: req.user._id }).distinct("_id");
    filter = { donation: { $in: donationIds } };
  }
  const assignments = await DeliveryAssignment.find(filter)
    .populate({
      path: "donation",
      select: "donor foodName foodType quantity unit pickupLocation expiresAt",
      populate: { path: "donor", select: "username phoneNumber address location" },
    })
    .populate("organization", "username organizationName organizationType phoneNumber address location")
    .populate("volunteer", "username phoneNumber address location")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, assignments, "Deliveries fetched successfully"));
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const assignment = await updateAssignmentStatus(
    req.params.id,
    req.user,
    req.body.status,
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, assignment, "Delivery status updated successfully"),
    );
});
