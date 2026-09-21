import { Router } from "express";
import { listNotifications, markNotificationRead } from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT);
router.get("/", listNotifications);
router.patch("/:id/read", markNotificationRead);
export default router;