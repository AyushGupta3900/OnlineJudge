import express from "express";
import {
  submitProblem,
  getSubmissionsByUserOnProblem,
  getSingleSubmission, 
} from "../controllers/submission.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.post("/submit", submitProblem);
router.get("/user/:id", getSubmissionsByUserOnProblem);
router.get("/:id", getSingleSubmission);

export default router;