import express from "express";
import {
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  registerTeacher,
  getAssignedClassesAndStudents
} from "../controllers/Teacher.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/assigned-classes", protect, getAssignedClassesAndStudents);

// Admin only — protect middleware required
router.post("/register", protect, registerTeacher);
router.get("/", protect, getTeachers);
router.get("/:id", protect, getTeacherById);
router.put("/:id", protect, updateTeacher);
router.delete("/:id", protect, deleteTeacher);
export default router;
