import { User } from "../model/user.model.js";
import { FoodDonation } from "../model/foodDonation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { MATCHING_RADIUS_STAGES_KM } from "../config/matching.js";

export const findNearbyOrganizations = async (donationId, maxDistanceKm = MATCHING_RADIUS_STAGES_KM.at(-1)) => {
  const donation = await FoodDonation.findById(donationId).select("pickupLocation deliveryPreference status");
  if (!donation) throw new ApiError(404, "Donation not found");
  const organizations = await User.find({
    role: "organization",
    isVerified: true,
    ...(donation.deliveryPreference === "self_delivery" ? { hasTransport: true } : {}),
    location: {
      $near: {
        $geometry: donation.pickupLocation,
        $maxDistance: maxDistanceKm * 1000,
      },
    },
  }).select("username organizationName organizationType hasTransport location");
  return organizations;
};