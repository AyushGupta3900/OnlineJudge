import express from "express";
import {signupUser,loginUser,onboardingUser, logoutUser, getAllUsers, makeAdmin, deleteUserAccount, updateUserAccount} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/onboarding",protectedRoute,onboardingUser);
router.delete("/delete-account", protectedRoute, deleteUserAccount);
router.patch("/update-account", protectedRoute, updateUserAccount);
router.get("/admin/all",protectedRoute,adminOnly,getAllUsers);
router.patch("/admin/make/:id",protectedRoute,adminOnly,makeAdmin);

// check if user is logged in
router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;