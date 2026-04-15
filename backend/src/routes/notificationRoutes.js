import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings
  
} from '../controllers/notificationController.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Notification routes
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:notificationId/read', protect, markAsRead);
router.put('/notifications/read-all', protect, markAllAsRead);
router.delete('/notifications/:notificationId', protect, deleteNotification);

// Notification settings routes
router.get('/notification-settings', protect, getNotificationSettings);
router.put('/notification-settings', protect, updateNotificationSettings);

export default router;