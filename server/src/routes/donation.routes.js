import { Router } from "express";
import { createDonation, getDonation, listDonations, updateDonation, cancelDonation } from "../controller/donation.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/authMiddleware.js";
import { donationValidation } from "../middleware/validation.js";
import { foodImageUpload, parseDonationMultipartFields } from "../middleware/upload.middleware.js";

const router = Router();
router.use(verifyJWT);
router.post("/", authorizeRoles("donor"), foodImageUpload.array("images", 5), parseDonationMultipartFields, donationValidation, createDonation);
router.get("/", listDonations);
router.get("/:id", getDonation);
router.patch("/:id", authorizeRoles("donor"), updateDonation);
router.post("/:id/cancel", authorizeRoles("donor"), cancelDonation);
export default router;