import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { 
  Users, 
  School, 
  BookOpen, 
  TrendingUp, 
  UserPlus, 
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");

  // Sample data - Replace with your actual API data
  const statsCards = [
    { 
      title: "Total Students", 
      value: "1,240", 
      change: "+12%", 
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "blue"
    },
    { 
      title: "Teachers", 
      value: "85", 
      change: "+5%", 
      trend: "up",
      icon: School,
      color: "from-green-500 to-emerald-500",
      bgColor: "green"
    },
    { 
      title: "Classes", 
      value: "42", 
      change: "+2%", 
      trend: "up",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      bgColor: "purple"
    },
    { 
      title: "Attendance Today", 
      value: "98%", 
      change: "-1%", 
      trend: "down",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      bgColor: "orange"
    },
  ];

  // Enrollment trends data
  const enrollmentData = [
    { month: "Jan", students: 1120, teachers: 78, classes: 38 },
    { month: "Feb", students: 1150, teachers: 80, classes: 39 },
    { month: "Mar", students: 1180, teachers: 81, classes: 40 },
    { month: "Apr", students: 1200, teachers: 83, classes: 41 },
    { month: "May", students: 1220, teachers: 84, classes: 41 },
    { month: "Jun", students: 1240, teachers: 85, classes: 42 },
  ];

  // Attendance data
  const attendanceData = [
    { day: "Mon", present: 92, absent: 8 },
    { day: "Tue", present: 94, absent: 6 },
    { day: "Wed", present: 96, absent: 4 },
    { day: "Thu", present: 95, absent: 5 },
    { day: "Fri", present: 98, absent: 2 },
  ];

  // Grade distribution data
  const gradeData = [
    { name: "A+", students: 245, color: "#10b981" },
    { name: "A", students: 380, color: "#3b82f6" },
    { name: "B+", students: 310, color: "#8b5cf6" },
    { name: "B", students: 180, color: "#f59e0b" },
    { name: "C", students: 85, color: "#ef4444" },
  ];

  // Department distribution
  const departmentData = [
    { name: "Science", value: 35, color: "#3b82f6" },
    { name: "Commerce", value: 25, color: "#10b981" },
    { name: "Arts", value: 20, color: "#8b5cf6" },
    { name: "Vocational", value: 20, color: "#f59e0b" },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, action: "New student enrolled", user: "Admin", time: "2 mins ago", icon: UserPlus },
    { id: 2, action: "Teacher assigned to class", user: "Academic Head", time: "1 hour ago", icon: School },
    { id: 3, action: "Exam results published", user: "Exam Controller", time: "3 hours ago", icon: TrendingUp },
    { id: 4, action: "Parent-teacher meeting scheduled", user: "Coordinator", time: "5 hours ago", icon: Calendar },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">Welcome back! Here's what's happening in your school today.</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 rounded-xl border transition-all duration-300"
              style={{ 
                background: "var(--card)", 
                color: "var(--text)", 
                borderColor: "var(--border)" 
              }}
            >
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last Month</option>
              <option value="yearly">Last Year</option>
            </select>
            
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{ 
                background: "var(--card)", 
                color: "var(--text)", 
                borderColor: "var(--border)" 
              }}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stat.change}
                    {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm opacity-70">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Enrollment Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                <Line type="monotone" dataKey="teachers" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Overview */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Weekly Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }} 
                />
                <Legend />
                <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <activity.icon size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{activity.action}</p>
                  <p className="text-xs opacity-60">by {activity.user}</p>
                </div>
                <p className="text-xs opacity-50">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;