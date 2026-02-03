import express from "express";
import { registerTeacher } from "../controllers/Teacher.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin only — protect middleware required
router.post("/register", protect, registerTeacher);

export default router;
