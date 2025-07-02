import express from "express";
import {getAllProblems,getProblem,createProblem,editProblem, deleteProblem} from "../controllers/problem.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {adminOnly} from "../middlewares/adminOnly.middleware.js"
import { createProblemFromArray } from "../controllers/problem.controller.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/all",getAllProblems);
router.post("/admin/new",adminOnly,createProblem);
router.patch("/admin/:id",adminOnly,editProblem);
router.delete("/admin/:id",adminOnly,deleteProblem);
router.post("/batch-create", adminOnly, createProblemFromArray);
router.get("/:id",getProblem);

export default router;