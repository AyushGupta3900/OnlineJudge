import express from "express";
import {signupUser,loginUser,onboardingUser, logoutUser} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/onboarding",protectedRoute,onboardingUser);

export default router;