import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  submitGrade,
  getTeacherGrades,
  getAllGrades,
  getParentGrades,
  getStudentGrades
} from "../controllers/Grade.controller.js";

const router = express.Router();

router.post("/submit", protect, submitGrade);
router.get("/teacher", protect, getTeacherGrades);
router.get("/all", protect, getAllGrades);
router.get("/parent", protect, getParentGrades);
router.get("/student", protect, getStudentGrades);

export default router;
