import express from "express";
import {signupUser,loginUser,onboardingUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signupUser);
router.post("login",loginUser);
router.post("onboarding",onboardingUser);

export default router;