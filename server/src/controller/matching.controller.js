import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { findNearbyOrganizations } from "../services/matching.service.js";

export const getNearbyOrganizations = asyncHandler(async (req, res) => {
  const maxDistanceKm = Number(req.query.maxDistanceKm || 20);
  if (!Number.isFinite(maxDistanceKm) || maxDistanceKm <= 0) {
    return res.status(400).json({ success: false, message: "maxDistanceKm must be a positive number" });
  }
  const organizations = await findNearbyOrganizations(req.params.donationId, maxDistanceKm);
  res.status(200).json(new ApiResponse(200, organizations, "Nearby organizations fetched successfully"));
});