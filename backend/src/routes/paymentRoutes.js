import express from 'express';
import {
  getPaymentSettings,
  updatePaymentSettings,
  generateMonthlyPayments,
  getAllStudentPayments,
  getStudentPayments,
  manualPaymentEntry,
  applyLateFees,
  checkAndSuspendStudents,
  generatePaymentReport,
  getPaymentAcademicYears,
  getParentChildren
} from '../controllers/paymentController.js';
import {
  initializePayment,
  verifyPayment,
  chapaWebhook,
  getPaymentStatus
} from '../controllers/chapaController.js';

import protect from '../middleware/auth.middleware.js';

const router = express.Router();
// Add this route FIRST (before other routes)
router.get('/payments/academic-years', protect, getPaymentAcademicYears);
router.get('/parent/children', protect, getParentChildren);
// Payment settings
router.get('/payment-settings', protect, getPaymentSettings);
router.put('/payment-settings', protect, updatePaymentSettings);

// Generate payments (Admin only)
router.post('/payments/generate', protect, generateMonthlyPayments);

// View payments
router.get('/payments/all', protect, getAllStudentPayments);
router.get('/payments/student/:studentId', protect, getStudentPayments);

// Manual payment entry (Admin only)
router.post('/payments/manual', protect, manualPaymentEntry);

// Automated tasks (Admin only - also run via cron)
router.post('/payments/apply-fines', protect, applyLateFees);
router.post('/payments/check-suspension', protect, checkAndSuspendStudents);

// Reports
router.get('/payments/reports', protect, generatePaymentReport);


// Chapa payment endpoints
router.post('/payments/chapa/initialize', protect, initializePayment);
router.get('/payments/chapa/verify', verifyPayment);
router.post('/payments/chapa/webhook', chapaWebhook);
router.get('/payments/chapa/status/:tx_ref', protect, getPaymentStatus);
export default router;