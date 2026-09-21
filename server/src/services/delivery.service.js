import { DeliveryAssignment } from "../model/deliveryAssignment.model.js";
import { FoodDonation } from "../model/foodDonation.model.js";
import { DeliveryRequest } from "../model/deliveryRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotifications } from "./notification.service.js";

export const statusTransitions = {
  assigned: ["accepted", "failed"],
  accepted: ["pickup_started", "failed"],
  pickup_started: ["picked_up", "failed"],
  picked_up: ["in_transit", "failed"],
  in_transit: ["delivered", "failed"],
  delivered: ["completed"],
  completed: [],
  failed: [],
};

export const expireReservation = async (requestId) => {
  const request = await DeliveryRequest.findOneAndUpdate(
    { _id: requestId, status: "pending", expiresAt: { $lte: new Date() } },
    { status: "expired" },
    { new: true },
  );
  if (!request) return null;

  await FoodDonation.findOneAndUpdate(
    { _id: request.donation, status: "temporarily_reserved", "currentReservation.organization": request.requester, "currentReservation.reservedUntil": { $lte: new Date() } },
    { status: "searching", $unset: { currentReservation: 1 } },
  );
  return request;
};

export const updateAssignmentStatus = async (assignmentId, user, nextStatus) => {
  const assignment = await DeliveryAssignment.findById(assignmentId);
  if (!assignment) throw new ApiError(404, "Delivery assignment not found");
  if (!statusTransitions[assignment.status]?.includes(nextStatus)) {
    throw new ApiError(409, `Invalid delivery transition: ${assignment.status} to ${nextStatus}`);
  }

  const donation = await FoodDonation.findById(assignment.donation).select("donor");
  const isVolunteer = assignment.volunteer?.equals(user._id);
  const isOrganization = assignment.organization.equals(user._id);
  const isDonor = assignment.deliveryMode === "donor" && donation?.donor.equals(user._id);
  if (!isVolunteer && !isOrganization && !isDonor && user.role !== "admin") throw new ApiError(403, "You cannot update this delivery");
  if (nextStatus === "completed" && !isOrganization && user.role !== "admin") throw new ApiError(403, "Only the organization can complete delivery");

  assignment.status = nextStatus;
  if (nextStatus === "picked_up") assignment.pickedUpAt = new Date();
  if (nextStatus === "delivered") assignment.deliveredAt = new Date();
  await assignment.save();
  if (nextStatus === "delivered" || nextStatus === "completed") {
    await FoodDonation.findOneAndUpdate({ _id: assignment.donation, status: nextStatus === "delivered" ? "in_transit" : "delivered" }, { status: nextStatus });
    const deliveryDonation = await FoodDonation.findById(assignment.donation).select("donor");
    await createNotifications([assignment.organization, deliveryDonation.donor], { type: "delivery_completed", message: `Delivery status updated to ${nextStatus}.`, donation: assignment.donation, assignment: assignment._id });
  }
  return assignment;
};