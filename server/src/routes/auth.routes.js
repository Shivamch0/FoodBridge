import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);
export default router;