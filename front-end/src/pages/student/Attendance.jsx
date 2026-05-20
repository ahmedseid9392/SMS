import React from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";

const AttendanceView = () => {
  const { user } = useAuth();
  const data = user.role === "PARENT" ? user.child : user;
  const isParent = user.role === "PARENT";
  const attendance = data?.attendance || [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isParent ? `${data.name}'s Attendance` : "My Attendance"}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">{record.date}</td>
                  <td className="px-4 py-3 text-center font-medium">
                    <span className={`${record.status === "Present" ? "text-green-600" : "text-red-600"}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendance.length === 0 && (
            <p className="text-center py-4 text-gray-500">No attendance records yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceView;
