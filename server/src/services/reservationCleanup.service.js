import { DeliveryRequest } from "../model/deliveryRequest.model.js";
import { FoodDonation } from "../model/foodDonation.model.js";
import { createNotifications } from "./notification.service.js";

export const cleanupExpiredReservations = async () => {
  const expiredDonations = await FoodDonation.find({
    status: { $in: ["available", "searching", "temporarily_reserved"] },
    expiresAt: { $lte: new Date() },
  }).select("_id donor");
  if (expiredDonations.length) {
    await FoodDonation.updateMany(
      { _id: { $in: expiredDonations.map((donation) => donation._id) } },
      { status: "expired", $unset: { currentReservation: 1 } },
    );
    await createNotifications(expiredDonations.map((donation) => donation.donor), {
      type: "reservation_expired",
      message: "Your food donation expired and is no longer available.",
    });
  }
  const expiredRequests = await DeliveryRequest.find({ status: "pending", expiresAt: { $lte: new Date() } }).select("_id donation requester");
  if (!expiredRequests.length) return expiredDonations.length;

  await DeliveryRequest.updateMany({ _id: { $in: expiredRequests.map((request) => request._id) } }, { status: "expired" });
  const donationIds = [...new Set(expiredRequests.map((request) => request.donation.toString()))];
  const released = await FoodDonation.updateMany({ _id: { $in: donationIds }, status: "temporarily_reserved", "currentReservation.reservedUntil": { $lte: new Date() } }, { status: "searching", $unset: { currentReservation: 1 } });
  await createNotifications(expiredRequests.map((request) => request.requester), { type: "reservation_expired", message: "A food reservation expired because no volunteer accepted it." });
  return released.modifiedCount;
};

export const startReservationCleanup = () => {
  const intervalMs = Number(process.env.CLEANUP_INTERVAL_MS || 60_000);
  const interval = setInterval(() => cleanupExpiredReservations().catch((error) => console.error("Reservation cleanup failed", error)), intervalMs);
  interval.unref();
  return interval;
};