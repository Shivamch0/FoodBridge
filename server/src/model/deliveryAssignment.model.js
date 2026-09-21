import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: "FoodDonation", required: true, unique: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryMode: { type: String, enum: ["donor", "organization", "volunteer"], required: true },
  pickupLocation: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
  deliveryLocation: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
  status: { type: String, enum: ["assigned", "accepted", "pickup_started", "picked_up", "in_transit", "delivered", "completed", "failed"], default: "assigned", index: true },
  assignedAt: { type: Date, default: Date.now },
  pickedUpAt: { type: Date },
  deliveredAt: { type: Date },
  proofOfDelivery: { type: String },
}, { timestamps: true });

export const DeliveryAssignment = mongoose.model("DeliveryAssignment", deliveryAssignmentSchema);