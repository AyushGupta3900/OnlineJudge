import express from "express";
import {generateBoilerplate, generateTestCases, getAiReview} from "../controllers/ai.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/review",protectedRoute,getAiReview);
router.post("/generate-boilerplate",protectedRoute,generateBoilerplate);
router.post("/generate-testcases",protectedRoute,generateTestCases);

export default router;