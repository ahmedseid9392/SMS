import React from "react";
import Layout from "../../components/layout/Layout";

const TeacherDashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Teacher Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
            <h3 className="text-5xl mb-2">📚</h3>
            <p className="text-xl font-semibold">My Classes</p>
            <p className="text-gray-600">View and manage your classes</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
            <h3 className="text-5xl mb-2">✅</h3>
            <p className="text-xl font-semibold">Take Attendance</p>
            <p className="text-gray-600">Mark daily attendance</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
            <h3 className="text-5xl mb-2">📝</h3>
            <p className="text-xl font-semibold">Enter Grades</p>
            <p className="text-gray-600">Record student results</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;