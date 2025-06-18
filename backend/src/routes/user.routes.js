import express from "express";
import {getAllUsers} from "../controllers/user.controller.js";
import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all",protectedRoute,adminOnly,getAllUsers);

export default router;