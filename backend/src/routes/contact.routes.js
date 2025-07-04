import express from "express";
import { sendContactMessage, getContactMessages } from "../controllers/contact.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {adminOnly} from "../middlewares/adminOnly.middleware.js"

const router = express.Router();


router.use(protectedRoute);

router.post("/", sendContactMessage);
router.get("/admin/all", adminOnly ,getContactMessages);

export default router;