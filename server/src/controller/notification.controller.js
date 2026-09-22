import { Notification } from "../model/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate({
      path: "donation",
      select: "foodName foodType quantity unit pickupLocation expiresAt donor",
      populate: { path: "donor", select: "username phoneNumber address location" },
    })
    .populate("request", "status expiresAt requester requesterType")
    .populate({
      path: "assignment",
      select: "status organization volunteer pickupLocation deliveryLocation",
      populate: [
        { path: "organization", select: "username organizationName phoneNumber address location" },
        { path: "volunteer", select: "username phoneNumber address location" },
      ],
    })
    .sort({ createdAt: -1 })
    .limit(100);
  res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully"),
    );
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id, readAt: { $exists: false } },
    { readAt: new Date() },
    { new: true },
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});
