import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  submitGrade,
  getTeacherGrades,
  getAllGrades,
  getParentGrades,
  getStudentGrades,
  getGradesForClass,
  getStudentSemesterTotals,

  adminComputeSemesterTotals,
  adminComputeRanking,
  adminComputeTop3,
   adminReleaseGrades

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

  //admin route
router.post("/compute-totals", protect, adminComputeSemesterTotals);
router.post("/compute-ranking", protect, adminComputeRanking);
router.post("/top3", protect, adminComputeTop3);
router.post("/release", protect, adminReleaseGrades);
//router.patch("/unlock/:id", adminUnlockGrade);





export default router;
