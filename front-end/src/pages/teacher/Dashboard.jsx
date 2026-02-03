import React from "react";
import Layout from "../../components/layout/Layout";
import ThemedCard from "../../components/ui/ThemedCard";

import { BookOpen, CheckSquare, FileEdit } from "lucide-react";

const TeacherDashboard = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Title Card */}
        <ThemedCard>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Teacher Dashboard
          </h1>
        </ThemedCard>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          
          {/* My Classes */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg 
                          text-center hover:shadow-2xl transition transform hover:-translate-y-1">
            <BookOpen size={55} className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xl font-semibold text-gray-800 dark:text-white">My Classes</p>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your classes
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg 
                          text-center hover:shadow-2xl transition transform hover:-translate-y-1">
            <CheckSquare size={55} className="mx-auto mb-4 text-green-600 dark:text-green-400" />
            <p className="text-xl font-semibold text-gray-800 dark:text-white">Take Attendance</p>
            <p className="text-gray-600 dark:text-gray-300">
              Mark daily attendance
            </p>
          </div>

          {/* Grades */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg 
                          text-center hover:shadow-2xl transition transform hover:-translate-y-1">
            <FileEdit size={55} className="mx-auto mb-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xl font-semibold text-gray-800 dark:text-white">Enter Grades</p>
            <p className="text-gray-600 dark:text-gray-300">
              Record student results
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
