import { DeliveryAssignment } from "../model/deliveryAssignment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { updateAssignmentStatus } from "../services/delivery.service.js";

export const listDeliveries = asyncHandler(async (req, res) => {
  const filter = req.user.role === "volunteer" ? { volunteer: req.user._id } : req.user.role === "organization" ? { organization: req.user._id } : {};
  const assignments = await DeliveryAssignment.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, assignments, "Deliveries fetched successfully"));
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const assignment = await updateAssignmentStatus(req.params.id, req.user, req.body.status);
  res.status(200).json(new ApiResponse(200, assignment, "Delivery status updated successfully"));
});