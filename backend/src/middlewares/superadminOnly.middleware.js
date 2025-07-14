import { AppError } from "../utils/AppError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const superadminOnly = TryCatch((req, res, next) => {
  if (req.user && req.user.isSuperadmin) {
    return next();
  }
  throw new AppError("Access denied: Superadmin only", 403);
});
