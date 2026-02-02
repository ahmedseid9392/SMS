import React from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const data = user.role === "PARENT" ? user.child : user;
  const isParent = user.role === "PARENT";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isParent ? `${data.name}'s Notifications` : "My Notifications"}
        </h1>

        <div className="space-y-4">
          {data.notifications.map((notif, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
              <p className="flex-1">{notif.message}</p>
              <p className="text-sm text-gray-500">{notif.date}</p>
            </div>
          ))}
          {data.notifications.length === 0 && (
            <p className="text-center py-4 text-gray-500">No notifications yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;