import express from "express";
import {generateAiHint, generateBoilerplate, generateTestCases, getAiReview} from "../controllers/ai.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = express.Router();

router.post("/review",optionalAuth,getAiReview);
router.post("/generate-boilerplate",optionalAuth,generateBoilerplate);
router.post("/generate-testcases",optionalAuth,generateTestCases);
router.post("/generate-ai-hint",optionalAuth,generateAiHint);

export default router;