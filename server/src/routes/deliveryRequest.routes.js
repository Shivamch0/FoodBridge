import { Router } from "express";
import { acceptVolunteerRequest, createDeliveryRequest, expireDeliveryRequest, listDeliveryRequests, rejectVolunteerRequest } from "../controller/deliveryRequest.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT);
router.get("/", listDeliveryRequests);
router.post("/", authorizeRoles("organization"), createDeliveryRequest);
router.post("/:id/volunteer-accept", authorizeRoles("volunteer"), acceptVolunteerRequest);
router.post("/:id/volunteer-reject", authorizeRoles("volunteer"), rejectVolunteerRequest);
router.post("/:id/expire", authorizeRoles("organization", "admin"), expireDeliveryRequest);
export default router;