import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const adminOnly = TryCatch((req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new AppError("Access denied: Admins only", 403);
});
