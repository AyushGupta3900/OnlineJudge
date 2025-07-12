import express from "express";
import {
  createContest,
  updateContest,
  deleteContest,
  getContest,
  getAllContests,
  registerForContest,
  getLeaderboard,
  submitContestSolution,
} from "../controllers/contest.controller.js";
import { protectedRoute  } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

const router = express.Router();

router.post("/admin/new", protectedRoute, adminOnly, createContest);
router.patch("/admin/:id", protectedRoute, adminOnly, updateContest);
router.delete("/admin/:id", protectedRoute, adminOnly, deleteContest);

router.get("/all", getAllContests);
router.get("/:id", getContest);
router.post("/:id/register", protectedRoute, registerForContest);

router.get("/:id/contest-leaderboard", getLeaderboard);

router.post("/:id/submit/:problemId", protectedRoute, submitContestSolution);

export default router;
