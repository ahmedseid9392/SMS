// backend/src/scripts/createSampleNotifications.js
import mongoose from 'mongoose';
import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';

async function createSampleNotifications() {
  try {
    await mongoose.connect('mongodb://localhost:27017/school_management');
    
    // Get all users
    const users = await User.find();
    
    for (const user of users) {
      // Create sample notifications for each user
      await Notification.create([
        {
          recipient: user._id,
          recipientRole: user.role,
          title: "Welcome to Green Valley School!",
          message: "We're excited to have you on board. Explore the dashboard to get started.",
          type: "SUCCESS",
          isRead: false
        },
        {
          recipient: user._id,
          recipientRole: user.role,
          title: "Profile Setup",
          message: "Please complete your profile by adding a profile picture and contact information.",
          type: "INFO",
          isRead: false
        },
        {
          recipient: user._id,
          recipientRole: user.role,
          title: "System Update",
          message: "New features have been added to the grade submission system.",
          type: "SYSTEM",
          isRead: false
        }
      ]);
    }
    
    console.log("Sample notifications created!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

createSampleNotifications();