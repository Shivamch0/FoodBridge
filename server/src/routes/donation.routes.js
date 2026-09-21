import { Router } from "express";
import { createDonation, getDonation, listDonations, updateDonation, cancelDonation } from "../controller/donation.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT);
router.post("/", authorizeRoles("donor"), createDonation);
router.get("/", listDonations);
router.get("/:id", getDonation);
router.patch("/:id", authorizeRoles("donor"), updateDonation);
router.post("/:id/cancel", authorizeRoles("donor"), cancelDonation);
export default router;