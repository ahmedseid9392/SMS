import React from "react";
import Layout from "../../components/layout/Layout";

const StudentDashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Student Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">🏆 Recent Results</h2>
            <ul className="space-y-3">
              <li className="flex justify-between"><span>Mathematics</span> <strong>A</strong></li>
              <li className="flex justify-between"><span>English</span> <strong>A-</strong></li>
              <li className="flex justify-between"><span>Science</span> <strong>B+</strong></li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">📌 Upcoming Assignments</h2>
            <ul className="space-y-3">
              <li>Math Project – Due Jan 10</li>
              <li>Essay on Climate Change – Due Jan 15</li>
              <li>Physics Lab Report – Due Jan 20</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <p className="text-lg">Welcome back, Ahmed! Keep up the great work! 🚀</p>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;