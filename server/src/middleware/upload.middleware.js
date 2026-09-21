import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, "../../uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    callback(null, `${Date.now()}-${safeName}`);
  },
});

export const foodImageUpload = multer({
  storage,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
    callback(null, true);
  },
});

export const parseDonationMultipartFields = (req, res, next) => {
  if (typeof req.body.pickupLocation === "string") {
    try {
      req.body.pickupLocation = JSON.parse(req.body.pickupLocation);
    } catch {
      return res.status(400).json({ success: false, message: "pickupLocation must be valid JSON" });
    }
  }
  if (typeof req.body.images === "string") req.body.images = [req.body.images];
  next();
};