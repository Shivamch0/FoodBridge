import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { loginValidation, registerValidation } from "../middleware/validation.js";

const router = Router();
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);

export default router;