import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const protectedRoute = TryCatch(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AppError("Unauthorized - No token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new AppError("Unauthorized - Invalid token", 401);
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new AppError("Unauthorized - User not found", 401);
  }

  req.user = user;
  next();
});