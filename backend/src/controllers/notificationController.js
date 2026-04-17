import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";

// Get user's notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;
    
    let query = {
      recipient: userId,
      isDeleted: false
    };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false
    });
    
    res.json({
      success: true,
      notifications,
      unreadCount,
      totalCount,
      hasMore: totalCount > parseInt(offset) + notifications.length
    });
    
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({
      success: true,
      message: "Notification marked as read",
      notification
    });
    
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.updateMany(
      { recipient: userId, isRead: false, isDeleted: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      message: "All notifications marked as read"
    });
    
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isDeleted: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({
      success: true,
      message: "Notification deleted"
    });
    
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// Create notification (for system use)
export const createNotification = async (recipientId, recipientRole, title, message, type = "INFO", data = {}) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      recipientRole,
      title,
      message,
      type,
      data
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

// Bulk create notifications
export const createBulkNotifications = async (recipients, title, message, type = "INFO", data = {}) => {
  try {
    const notifications = recipients.map(recipient => ({
      recipient: recipient.userId,
      recipientRole: recipient.role,
      title,
      message,
      type,
      data
    }));
    
    await Notification.insertMany(notifications);
    return true;
  } catch (error) {
    console.error("Bulk create notifications error:", error);
    return false;
  }
};

// Get notification settings
export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('notificationSettings');
    
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      gradeAlerts: true,
      attendanceAlerts: true,
      assignmentAlerts: true,
      systemUpdates: false
    };
    
    const settings = user?.notificationSettings || defaultSettings;
    
    res.json({
      success: true,
      settings
    });
    
  } catch (error) {
    console.error("Get notification settings error:", error);
    res.status(500).json({ message: "Failed to fetch notification settings" });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { notificationSettings: settings },
      { new: true }
    );
    
    res.json({
      success: true,
      message: "Notification settings updated",
      settings: user.notificationSettings
    });
    
  } catch (error) {
    console.error("Update notification settings error:", error);
    res.status(500).json({ message: "Failed to update notification settings" });
  }
};

// Send grade release notification
export const notifyGradeRelease = async (studentId, courseName, grade) => {
  const title = "Grade Released";
  const message = `Your grade for ${courseName} has been released: ${grade}%`;
  return await createNotification(studentId, "STUDENT", title, message, "GRADE_RELEASED", { courseName, grade });
};

// Send assignment notification
export const notifyAssignment = async (studentId, assignmentName, dueDate) => {
  const title = "New Assignment";
  const message = `New assignment "${assignmentName}" is due on ${new Date(dueDate).toLocaleDateString()}`;
  return await createNotification(studentId, "STUDENT", title, message, "ASSIGNMENT", { assignmentName, dueDate });
};

// Send attendance notification
export const notifyAttendance = async (studentId, status, date) => {
  const title = "Attendance Recorded";
  const message = `Your attendance for ${new Date(date).toLocaleDateString()} was marked as ${status}`;
  return await createNotification(studentId, "STUDENT", title, message, "ATTENDANCE", { status, date });
};