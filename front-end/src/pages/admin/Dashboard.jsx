import React from "react";
import Layout from "../../components/layout/Layout";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-blue-600">1,240</h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-green-600">85</h3>
            <p className="text-gray-600">Teachers</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-purple-600">42</h3>
            <p className="text-gray-600">Classes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-orange-600">98%</h3>
            <p className="text-gray-600">Attendance Today</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, Administrator</h2>
          <p className="text-gray-700">
            Manage students, teachers, classes, and monitor overall school performance from here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;