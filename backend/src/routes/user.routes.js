import express from "express";
import { deleteUserAccount, getAllUsers, getLeaderboard, getProfileStats, getUserSubmissions, makeAdmin, updateUserAccount } from "../controllers/user.controller.js"
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.delete("/delete-account",deleteUserAccount);
router.patch("/update-account",updateUserAccount);
router.get("/leaderboard",getLeaderboard);
router.get("/profile-stats",getProfileStats);
router.get("/all-submissions",getUserSubmissions);
router.get("/admin/all",getAllUsers);
router.patch("/admin/make/:id",adminOnly,makeAdmin);

export default router;