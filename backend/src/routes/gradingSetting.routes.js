import express from "express";
import protect from "../middleware/auth.middleware.js";
import { updateGradingSetting,  getGradingSetting } from "../controllers/GradeSetting.controller.js";

const router = express.Router();

// Only admin should access this
router.put("/", protect, updateGradingSetting);
router.get("/", protect, getGradingSetting);

export default router;
