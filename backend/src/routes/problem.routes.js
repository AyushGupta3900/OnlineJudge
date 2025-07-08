import express from "express";
import {getAllProblems,getProblem,createProblem,editProblem, deleteProblem, getProblemStatus} from "../controllers/problem.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {adminOnly} from "../middlewares/adminOnly.middleware.js"
import { createProblemFromArray } from "../controllers/problem.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = express.Router();

router.get("/all",optionalAuth,getAllProblems);
router.post("/admin/new",protectedRoute,adminOnly,createProblem);
router.patch("/admin/:id",protectedRoute,adminOnly,editProblem);
router.delete("/admin/:id",protectedRoute,adminOnly,deleteProblem);
router.post("/batch-create",protectedRoute,adminOnly, createProblemFromArray);
router.get("/:id",optionalAuth,getProblem);
router.get("/status/:id", optionalAuth, getProblemStatus);

export default router;