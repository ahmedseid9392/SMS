import express from "express";
import { loginUser ,
          updateProfile,
          changePassword,
         // updateNotificationSettings
} from "../controllers/auth.controller.js";
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/login", loginUser);
router.put('/admin/profile', protect, updateProfile);
router.post('/admin/change-password', protect, changePassword);
//router.put('/admin/notification-settings', protect, updateNotificationSettings);

export default router;
