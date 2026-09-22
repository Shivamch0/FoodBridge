import { User } from "../model/user.model.js";


// ?  Utills
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const createTokens = (user) => ({
	accessToken: user.generateAccessToken(),
	refreshToken: user.generateRefreshToken(),
});

export const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, phoneNumber, role, organizationType, organizationName } = req.body;
	if (!username || !email || !password || !phoneNumber || !role) {
		throw new ApiError(400, "username, email, password, phoneNumber, and role are required");
	}
	if (!["donor", "organization", "volunteer"].includes(role)) {
		throw new ApiError(400, "Invalid registration role");
	}
	if (role === "organization" && (!organizationType || !organizationName)) {
		throw new ApiError(400, "Organization type and name are required");
	}
	if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");

	const existingUser = await User.findOne({ email: email.toLowerCase() });
	if (existingUser) throw new ApiError(409, "Email is already registered");

	const user = await User.create({ ...req.body, email: email.toLowerCase() });
	const safeUser = await User.findById(user._id).select("-password");
	res.status(201).json(new ApiResponse(201, safeUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) throw new ApiError(400, "Email and password are required");

	const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
	if (!user || !(await user.isPasswordCorrect(password))) {
		throw new ApiError(401, "Invalid email or password");
	}

	const { accessToken, refreshToken } = createTokens(user);
	const safeUser = await User.findById(user._id).select("-password");
	res.status(200)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(new ApiResponse(200, safeUser, "Login successful"));
});

export const logoutUser = asyncHandler(async (req, res) => {
	res.clearCookie("accessToken", cookieOptions).clearCookie("refreshToken", cookieOptions);
	res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
	res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
	const allowedFields = ["username", "phoneNumber", "organizationType", "organizationName", "hasTransport", "transportDetails", "address", "location", "isAvailable"];
	const updates = Object.fromEntries(Object.entries(req.body).filter(([field]) => allowedFields.includes(field)));
	const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
	if (!user) throw new ApiError(404, "User not found");
	res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
	const token = req.cookies?.refreshToken;
	if (!token) throw new ApiError(401, "Refresh token is required");
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
	} catch {
		throw new ApiError(401, "Invalid or expired refresh token");
	}
	const user = await User.findById(decoded._id);
	if (!user) throw new ApiError(401, "Invalid refresh token");
	res.status(200).cookie("accessToken", user.generateAccessToken(), cookieOptions)
		.json(new ApiResponse(200, null, "Access token refreshed"));
});

