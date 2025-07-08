import jwt from "jsonwebtoken";
import User  from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user || null;
  } catch {
    req.user = null;
  }

  next();
};