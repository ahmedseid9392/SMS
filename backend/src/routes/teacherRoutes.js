import express from "express";
import { registerTeacher,
    getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher } from "../controllers/Teacher.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin only — protect middleware required
router.post("/register", protect, registerTeacher);
router.get("/", protect, getTeachers);
router.get("/:id", protect, getTeacherById);
router.put("/:id", protect, updateTeacher);
router.delete("/:id", protect, deleteTeacher);
export default router;
