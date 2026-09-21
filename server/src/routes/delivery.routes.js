import { Router } from "express";
import { listDeliveries, updateDeliveryStatus } from "../controller/delivery.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT);
router.get("/", listDeliveries);
router.patch("/:id/status", updateDeliveryStatus);
export default router;