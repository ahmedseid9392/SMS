import express from 'express';
import {
  submitGrade,
  saveDraft,
  getTeacherGrades,
  getAllGrades,
  getParentGrades,
  getStudentGrades,
  adminComputeSemesterTotals,
  adminComputeRanking,
  adminComputeTop3,
  adminReleaseGrades,
  unlockGrade,
  getGradesForClass,
  getStudentSemesterTotals,
  getStudentReleasedResults,
  getStudentAcademicYears,
  getParentReleasedResults,
  getParentAcademicYears,
  requestGradeReview,
  checkSemester1Completion
} from '../controllers/Grade.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Teacher routes
router.post('/grades/submit',protect, submitGrade);
router.post('/grades/draft',protect, saveDraft);
router.get('/grades/teacher',protect, getTeacherGrades);
router.get('/grades/class/:classId',protect, getGradesForClass);
router.get('/grades/semester-totals/:studentId/:courseId', protect, getStudentSemesterTotals);

// Admin routes
router.get('/grades/all', protect, getAllGrades);
router.post('/grades/compute-totals', protect, adminComputeSemesterTotals);
router.post('/grades/compute-ranking', protect, adminComputeRanking);
router.post('/grades/compute-top3', protect, adminComputeTop3);
router.post('/grades/release', protect, adminReleaseGrades);
router.put('/grades/unlock/:id', protect, unlockGrade);
router.get('/grades/semester1-completion/:courseId',protect, checkSemester1Completion);
// Student routes - IMPORTANT: These need to be before the /grades/:id route
router.get('/student/results', protect, getStudentReleasedResults);
router.get('/student/results/academic-years', protect, getStudentAcademicYears);
router.post('/student/results/request-review', protect, requestGradeReview);

// Parent routes
router.get('/parent/grades', protect, getParentGrades);
router.get('/parent/results', protect, getParentReleasedResults);
router.get('/parent/results/academic-years', protect, getParentAcademicYears);

// Student grade view
router.get('/student/grades', protect, getStudentGrades);

export default router;
