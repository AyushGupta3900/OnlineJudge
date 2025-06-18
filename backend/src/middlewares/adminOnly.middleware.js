export function adminOnly(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
  } catch (error) {
    console.error("Error in adminOnly middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in adminOnly middleware",
    });
  }
}