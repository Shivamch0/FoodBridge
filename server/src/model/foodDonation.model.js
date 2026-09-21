import mongoose from "mongoose";

const foodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodName: { type: String, required: true, trim: true },
    foodType: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, required: true, trim: true },
    preparedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    images: [{ type: String }],
    pickupLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coordinates) => coordinates.length === 2,
          message: "Pickup coordinates must be [longitude, latitude]",
        },
      },
    },
    deliveryPreference: {
      type: String,
      enum: ["self_delivery", "organization_or_volunteer"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "available",
        "searching",
        "temporarily_reserved",
        "confirmed",
        "picked_up",
        "in_transit",
        "delivered",
        "completed",
        "expired",
        "cancelled",
      ],
      default: "available",
      index: true,
    },
    currentReservation: {
      organization: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reservedUntil: { type: Date },
    },
  },
  { timestamps: true },
);

foodDonationSchema.index({ pickupLocation: "2dsphere" });
export const FoodDonation = mongoose.model("FoodDonation", foodDonationSchema);
