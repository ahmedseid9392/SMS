import express from 'express';
import {
  getCurrentAcademicYear,
  getAllAcademicYears,
  createAcademicYear,
  setActiveAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  updateSemesterStatus
} from '../controllers/Grade.controller.js';
import  protect  from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
//router.use(authorize('ADMIN'));

router.get('/current', getCurrentAcademicYear);
router.get('/all', getAllAcademicYears);
router.post('/create', createAcademicYear);
router.put('/set-active/:id', setActiveAcademicYear);
router.put('/update/:id', updateAcademicYear);
router.delete('/delete/:id', deleteAcademicYear);
router.put('/semester-status', updateSemesterStatus);

export default router;