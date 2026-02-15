import React from "react";
import ThemedCard from "../../components/ui/ThemedCard";
import Layout from "../../components/layout/Layout";

const AdminDashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <ThemedCard>
          <h1 className="text-4xl font-bold text-black-900 dark:text-white mb-8"  
          style={{
              color: "var(--text)",
              }}>
            Admin Dashboard
          </h1>
        </ThemedCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,240</h3>
            <p className="text-gray-600 dark:text-gray-300">Total Students</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">85</h3>
            <p className="text-gray-600 dark:text-gray-300">Teachers</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">42</h3>
            <p className="text-gray-600 dark:text-gray-300">Classes</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">98%</h3>
            <p className="text-gray-600 dark:text-gray-300">Attendance Today</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Welcome back, Administrator
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            Manage students, teachers, classes, and monitor overall school performance from here.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
