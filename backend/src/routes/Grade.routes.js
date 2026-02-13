import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  submitGrade,
  getTeacherGrades,
  getAllGrades,
  getParentGrades,
  getStudentGrades,
  getGradesForClass,
  getStudentSemesterTotals
} from "../controllers/Grade.controller.js";

const router = express.Router();

router.post("/submit", protect, submitGrade);
router.post("/save", protect, submitGrade);
router.get("/teacher", protect, getTeacherGrades);
router.get("/all", protect, getAllGrades);
router.get("/parent", protect, getParentGrades);
router.get("/student", protect, getStudentGrades);
router.get("/class/:classId", protect, getGradesForClass);
router.get(
  "/semester-totals/:studentId/:courseId",protect,getStudentSemesterTotals);


export default router;
