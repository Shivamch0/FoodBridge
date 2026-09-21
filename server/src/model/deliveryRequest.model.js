import mongoose from "mongoose";

const deliveryRequestSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: "FoodDonation", required: true, index: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requesterType: { type: String, enum: ["organization", "volunteer"], required: true },
  distance: { type: Number, min: 0 },
  radius: { type: Number, min: 0 },
  hasTransport: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "accepted", "rejected", "expired", "cancelled"], default: "pending", index: true },
  expiresAt: { type: Date },
}, { timestamps: true });

deliveryRequestSchema.index({ donation: 1, requester: 1 }, { unique: true });
export const DeliveryRequest = mongoose.model("DeliveryRequest", deliveryRequestSchema);