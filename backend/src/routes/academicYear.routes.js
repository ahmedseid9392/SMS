import express from 'express';
import {
  getAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  setActiveAcademicYear,
  deleteAcademicYear,
  toggleSemester,
  getCurrentAcademicYear,
  getGradingSettings,
  updateGradingSettings
} from '../controllers/academicYear.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Academic Year routes
router.get('/', protect, getAcademicYears);
router.get('/:id', protect, getAcademicYearById);
router.post('/', protect, createAcademicYear);
router.put('/:id', protect, updateAcademicYear);
router.get('/current', protect, getCurrentAcademicYear);
router.put('/:id/activate', protect, setActiveAcademicYear);
router.delete('/:id', protect, deleteAcademicYear);
router.put('/:id/semester/:semester/toggle', protect, toggleSemester);

// Grading Settings routes
router.get('/grading-settings', protect, getGradingSettings);
router.put('/grading-settings', protect, updateGradingSettings);

export default router;