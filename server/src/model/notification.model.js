import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["new_food_available", "donation_reserved", "donation_accepted", "volunteer_needed", "volunteer_assigned", "pickup_reminder", "delivery_completed", "reservation_expired"], required: true },
  message: { type: String, required: true, trim: true, maxlength: 300 },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: "FoodDonation" },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryRequest" },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAssignment" },
  readAt: { type: Date },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);