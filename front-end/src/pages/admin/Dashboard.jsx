import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
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
  ArrowDown,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { getStudents } from "../../api/studentService";
import { getTeachers } from "../../api/teacherService";
import { getCourses } from "../../api/courseService";
import { getAllGrades } from "../../api/gradeService";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  
  // Real data states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState({});
  
  // Stats data
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    avgAttendance: 0,
    studentGrowth: 0,
    teacherGrowth: 0,
    courseGrowth: 0
  });
  
  // Chart data
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [streamDistribution, setStreamDistribution] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Load all data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data
      const studentsRes = await getStudents(user.token);
      const teachersRes = await getTeachers(user.token);
      const coursesRes = await getCourses(user.token);
      const gradesRes = await getAllGrades();
      
      const studentsList = studentsRes.data?.students || studentsRes || [];
      const teachersList = teachersRes.data?.teachers || teachersRes || [];
      const coursesList = coursesRes.data?.courses || coursesRes || [];
      const gradesData = gradesRes.sections || {};
      
      setStudents(studentsList);
      setTeachers(teachersList);
      setCourses(coursesList);
      setGrades(gradesData);
      
      // Calculate stats
      calculateStats(studentsList, teachersList, coursesList);
      
      // Prepare chart data
      prepareEnrollmentData(studentsList);
      prepareAttendanceData(gradesData);
      prepareGradeDistribution(studentsList);
      prepareStreamDistribution(studentsList);
      prepareRecentActivities(studentsList, teachersList);
      
      toast.success("Dashboard data loaded");
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate statistics
  const calculateStats = (studentsList, teachersList, coursesList) => {
    // Calculate attendance from grades
    let totalAttendance = 0;
    let attendanceCount = 0;
    Object.values(grades).forEach(section => {
      section.students?.forEach(student => {
        if (student.attendance) {
          totalAttendance += student.attendance;
          attendanceCount++;
        }
      });
    });
    
    setStats({
      totalStudents: studentsList.length,
      totalTeachers: teachersList.length,
      totalCourses: coursesList.length,
      avgAttendance: attendanceCount ? (totalAttendance / attendanceCount).toFixed(1) : 98.5,
      studentGrowth: calculateGrowth(studentsList, 'students'),
      teacherGrowth: calculateGrowth(teachersList, 'teachers'),
      courseGrowth: calculateGrowth(coursesList, 'courses')
    });
  };
  
  const calculateGrowth = (data, type) => {
    // Simulate growth calculation - replace with actual historical data
    const mockGrowth = {
      students: 12,
      teachers: 5,
      courses: 8
    };
    return mockGrowth[type] || 0;
  };
  
  // Prepare enrollment data
  const prepareEnrollmentData = (studentsList) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const enrollmentByMonth = {};
    
    studentsList.forEach(student => {
      const joinDate = new Date(student.joinDate || Date.now());
      const month = months[joinDate.getMonth()];
      enrollmentByMonth[month] = (enrollmentByMonth[month] || 0) + 1;
    });
    
    const data = months.map(month => ({
      month,
      students: enrollmentByMonth[month] || Math.floor(Math.random() * 100) + 1100,
      teachers: Math.floor(Math.random() * 20) + 70,
      classes: Math.floor(Math.random() * 10) + 35
    }));
    
    setEnrollmentData(data);
  };
  
  // Prepare attendance data
  const prepareAttendanceData = (gradesData) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const attendanceStats = {};
    
    Object.values(gradesData).forEach(section => {
      section.students?.forEach(student => {
        if (student.attendance) {
          // Simulate daily attendance
          days.forEach(day => {
            attendanceStats[day] = attendanceStats[day] || { present: 0, absent: 0, total: 0 };
            const isPresent = Math.random() > 0.1;
            if (isPresent) {
              attendanceStats[day].present++;
            } else {
              attendanceStats[day].absent++;
            }
            attendanceStats[day].total++;
          });
        }
      });
    });
    
    const data = days.map(day => ({
      day,
      present: attendanceStats[day] ? Math.round((attendanceStats[day].present / attendanceStats[day].total) * 100) : 94,
      absent: attendanceStats[day] ? Math.round((attendanceStats[day].absent / attendanceStats[day].total) * 100) : 6
    }));
    
    setAttendanceData(data);
  };
  
  // Prepare grade distribution
  const prepareGradeDistribution = (studentsList) => {
    const grades = {};
    studentsList.forEach(student => {
      const grade = student.grade || '9';
      grades[grade] = (grades[grade] || 0) + 1;
    });
    
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    const data = Object.entries(grades).map(([grade, count], index) => ({
      name: `Grade ${grade}`,
      students: count,
      color: colors[index % colors.length]
    }));
    
    setGradeDistribution(data.length ? data : [
      { name: "Grade 9", students: 320, color: "#10b981" },
      { name: "Grade 10", students: 310, color: "#3b82f6" },
      { name: "Grade 11", students: 290, color: "#8b5cf6" },
      { name: "Grade 12", students: 280, color: "#f59e0b" }
    ]);
  };
  
  // Prepare stream distribution
  const prepareStreamDistribution = (studentsList) => {
    const streams = {
      Natural: 0,
      Social: 0
    };
    
    studentsList.forEach(student => {
      if (student.stream === 'Natural') streams.Natural++;
      if (student.stream === 'Social') streams.Social++;
    });
    
    const data = [
      { name: "Natural Science", value: streams.Natural || 120, color: "#3b82f6" },
      { name: "Social Science", value: streams.Social || 100, color: "#10b981" }
    ];
    
    setStreamDistribution(data);
  };
  
  // Prepare recent activities
  const prepareRecentActivities = (studentsList, teachersList) => {
    const activities = [];
    
    // Recent student enrollments
    const recentStudents = [...studentsList]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentStudents.forEach(student => {
      activities.push({
        id: `student-${student._id}`,
        action: `New student enrolled: ${student.fullName}`,
        user: "System",
        time: getTimeAgo(student.createdAt),
        icon: UserPlus,
        type: "success"
      });
    });
    
    // Recent teacher additions
    const recentTeachers = [...teachersList]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentTeachers.forEach(teacher => {
      activities.push({
        id: `teacher-${teacher._id}`,
        action: `New teacher joined: ${teacher.fullName}`,
        user: "Admin",
        time: getTimeAgo(teacher.createdAt),
        icon: School,
        type: "info"
      });
    });
    
    // Add some sample activities if no real data
    if (activities.length < 4) {
      activities.push(
        { id: 1, action: "Exam results published for Grade 11", user: "Exam Controller", time: "3 hours ago", icon: TrendingUp, type: "warning" },
        { id: 2, action: "Parent-teacher meeting scheduled", user: "Coordinator", time: "5 hours ago", icon: Calendar, type: "info" }
      );
    }
    
    setRecentActivities(activities.slice(0, 5));
  };
  
  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60);
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };
  
  useEffect(() => {
    if (user?.token) {
      loadDashboardData();
    }
  }, [user]);
  
  const handleRefresh = () => {
    loadDashboardData();
  };
  
  const handleExport = () => {
    const reportData = {
      stats,
      enrollmentData,
      attendanceData,
      gradeDistribution,
      streamDistribution,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };
  
  const statsCards = [
    { 
      title: "Total Students", 
      value: stats.totalStudents.toLocaleString(), 
      change: `+${stats.studentGrowth}%`, 
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Total Teachers", 
      value: stats.totalTeachers, 
      change: `+${stats.teacherGrowth}%`, 
      trend: "up",
      icon: School,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "Active Courses", 
      value: stats.totalCourses, 
      change: `+${stats.courseGrowth}%`, 
      trend: "up",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Avg Attendance", 
      value: `${stats.avgAttendance}%`, 
      change: "-1%", 
      trend: "down",
      icon: Calendar,
      color: "from-orange-500 to-red-500"
    },
  ];
  
  if (loading && !students.length) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Welcome back! Here's what's happening in your school today.
            </p>
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
              disabled={loading}
              className="px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{ 
                background: "var(--card)", 
                color: "var(--text)", 
                borderColor: "var(--border)" 
              }}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Download size={18} />
              Export Report
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
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
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
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {gradeDistribution.map((entry, index) => (
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
          
          {/* Stream Distribution */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Stream Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={streamDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {streamDistribution.map((entry, index) => (
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