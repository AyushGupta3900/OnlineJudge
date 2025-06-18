import express from "express";
import {getAllProblems,getProblem,createProblem,editProblem} from "../controllers/problem.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {adminOnly} from "../middlewares/adminOnly.middleware.js"

const router = express.Router();

router.use(protectedRoute);

router.get("/all",getAllProblems);
router.post("/new",adminOnly,createProblem);
router.patch("/:id",adminOnly,editProblem);
router.get("/:id",getProblem);

export default router;