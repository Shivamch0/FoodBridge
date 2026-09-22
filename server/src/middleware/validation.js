import { validationResult, body } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiError(400, "Validation failed", errors.array());
    next();
  },
];

export const registerValidation = validate([
  body("username").isString().trim().isLength({ min: 2, max: 80 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 8, max: 128 }),
  body("phoneNumber").isString().trim().matches(/^[0-9+() -]{7,20}$/),
  body("role").isIn(["donor", "organization", "volunteer"]),
  body("address").isObject(),
  body("address.street").isString().trim().notEmpty(),
  body("address.city").isString().trim().notEmpty(),
  body("address.state").isString().trim().notEmpty(),
  body("address.pincode").isString().trim().notEmpty(),
  body("location").isObject(),
  body("location.type").equals("Point"),
  body("location.coordinates").isArray({ min: 2, max: 2 }),
  body("location.coordinates.*").isFloat(),
]);

export const loginValidation = validate([
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
]);

export const donationValidation = validate([
  body("foodName").isString().trim().isLength({ min: 2, max: 120 }),
  body("foodType").isString().trim().isLength({ min: 2, max: 80 }),
  body("quantity").isFloat({ min: 0.01 }),
  body("unit").isString().trim().isLength({ min: 1, max: 30 }),
  body("expiresAt").isISO8601(),
  body("pickupLocation").custom((location) => location?.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length === 2),
  body("pickupLocation.coordinates.*").isFloat(),
  body("deliveryPreference").isIn(["self_delivery", "organization_or_volunteer"]),
]);