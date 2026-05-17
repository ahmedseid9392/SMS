import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import api from "../../api/axios";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ParentNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications", {
        params: { limit: 100 },
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Failed to load notification history");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((item) => item._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notification History</h1>
          <p className="text-muted mt-1 text-sm">Review updates related to your account and linked children.</p>
        </div>

        <div className="surface-card rounded-[1.6rem] overflow-hidden">
          <div className="border-b p-5" style={{ borderColor: "var(--border)" }}>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Bell size={20} />
              Notifications
            </h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-muted">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-muted">No notifications found.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between"
                  style={{
                    background: notification.isRead ? "transparent" : "rgba(37,99,235,0.06)",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{notification.title}</p>
                      {!notification.isRead && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-muted mt-1 text-sm">{notification.message}</p>
                    <p className="text-muted mt-3 text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="rounded-lg px-3 py-2 text-sm font-medium"
                        style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle size={15} />
                          Read
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium"
                      style={{ background: "rgba(220,38,38,0.1)", color: "var(--danger)" }}
                    >
                      <span className="flex items-center gap-2">
                        <Trash2 size={15} />
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ParentNotifications;
