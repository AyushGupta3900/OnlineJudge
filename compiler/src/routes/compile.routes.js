import express from "express";
import { judgeSubmission } from "../controllers/compiler.controller.js";

const router = express.Router();

router.post("/submit", judgeSubmission);

export default router;