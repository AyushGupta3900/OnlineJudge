import express from "express";
import {submitProblem, getSubmissionsByUser, getSubmissionToProblem} from "../controllers/submission.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {adminOnly} from "../middlewares/adminOnly.middleware.js"

const router = express.Router();

app.use(protectedRoute);

router.post("/submit",submitProblem);
router.get("/user/submissions",getSubmissionsByUser);
router.get("/problem/submissions",adminOnly,getSubmissionToProblem);

export default router; 