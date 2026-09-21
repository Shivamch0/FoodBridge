import { Router } from "express";
import { getNearbyOrganizations } from "../controller/matching.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT, authorizeRoles("donor", "organization", "admin"));
router.get("/donations/:donationId/organizations", getNearbyOrganizations);
export default router;