import express from "express";
import {signupUser,loginUser,onboardingUser, logoutUser} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);

router.use(protectedRoute);

router.post("/onboarding",onboardingUser);

// check if user is logged in
router.get("/me",(req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;