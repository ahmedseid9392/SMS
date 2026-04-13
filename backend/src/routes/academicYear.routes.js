import express from 'express';
import {
  getAcademicYears,
  getCurrentAcademicYear,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  setActiveAcademicYear,
  deleteAcademicYear,
  toggleSemester
} from '../controllers/academicYear.controller.js';
import  protect  from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
//router.use(authorize('ADMIN'));

router.get('/', getAcademicYears);
router.get('/current', getCurrentAcademicYear);
router.get('/:id', getAcademicYearById);

// Admin only routes
router.post('/', createAcademicYear);
router.put('/:id', updateAcademicYear);
router.put('/:id/activate', setActiveAcademicYear);
router.delete('/:id', deleteAcademicYear);
router.put('/:id/semester/:semester/toggle', toggleSemester);

export default router;