import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import ThemedCard from "../../components/ui/ThemedCard";
import { useAuth } from "../../context/AuthContext";
//import  getStudentGrades  from "../../api/gradeService";
//import { getStudentAssignments } from "../../api/assignmentService";
//import { getStudentAttendance } from "../../api/attendanceService";
import { 
  BookOpen, 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  GraduationCap,
  FileText,
  BarChart3
} from "lucide-react";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageGrade: 0,
    attendanceRate: 0,
    pendingAssignments: 0
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch grades
      const gradesRes = await getStudentGrades();
      const grades = gradesRes.grades || gradesRes.data?.grades || [];
      
      // Fetch assignments
      const assignmentsRes = await getStudentAssignments();
      const assignments = assignmentsRes.assignments || assignmentsRes.data?.assignments || [];
      
      // Fetch attendance
      const attendanceRes = await getStudentAttendance();
      const attendance = attendanceRes.attendance || attendanceRes.data?.attendance || [];
      
      // Calculate statistics
      let totalScore = 0;
      let gradedCourses = 0;
      
      grades.forEach(grade => {
        if (grade.sem1?.total) {
          totalScore += grade.sem1.total;
          gradedCourses++;
        }
        if (grade.sem2?.total) {
          totalScore += grade.sem2.total;
          gradedCourses++;
        }
      });
      
      const avgGrade = gradedCourses > 0 ? (totalScore / gradedCourses).toFixed(1) : 0;
      
      // Calculate attendance rate
      let presentDays = 0;
      let totalDays = 0;
      attendance.forEach(record => {
        totalDays++;
        if (record.status === 'present') presentDays++;
      });
      const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 95;
      
      // Get pending assignments (not submitted)
      const pending = assignments.filter(a => !a.submitted).length;
      
      setStats({
        totalCourses: grades.length,
        averageGrade: avgGrade,
        attendanceRate: attendanceRate,
        pendingAssignments: pending
      });
      
      // Get recent grades (last 5)
      const recent = grades.slice(0, 5).map(grade => ({
        id: grade._id,
        course: grade.course?.name || "Course",
        score: grade.sem1?.total || grade.sem2?.total || 0,
        grade: getGradeLetter(grade.sem1?.total || grade.sem2?.total || 0),
        semester: grade.sem1?.total ? "Sem 1" : "Sem 2"
      }));
      setRecentGrades(recent);
      
      // Get upcoming assignments (next 5)
      const upcoming = assignments
        .filter(a => !a.submitted)
        .slice(0, 5)
        .map(assignment => ({
          id: assignment._id,
          title: assignment.title,
          course: assignment.course?.name,
          dueDate: formatDate(assignment.dueDate),
          priority: getPriority(assignment.dueDate)
        }));
      setUpcomingAssignments(upcoming);
      
      // Set recent activities
      const activities = [];
      
      if (recent.length > 0) {
        activities.push({
          id: 1,
          title: "New Grades Released",
          description: `${recent.length} new grade${recent.length > 1 ? 's have' : ' has'} been published`,
          time: "Today",
          icon: Award,
          color: "green"
        });
      }
      
      if (pending > 0) {
        activities.push({
          id: 2,
          title: "Assignments Pending",
          description: `${pending} assignment${pending > 1 ? 's are' : ' is'} waiting for submission`,
          time: "Urgent",
          icon: FileText,
          color: "yellow"
        });
      }
      
      activities.push({
        id: 3,
        title: "Attendance Summary",
        description: `Your attendance rate is ${attendanceRate}%`,
        time: "This Month",
        icon: Calendar,
        color: "blue"
      });
      
      setRecentActivities(activities);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
      
      // Set sample data for demo
      setRecentGrades([
        { id: 1, course: "Mathematics", score: 85, grade: "A", semester: "Sem 1" },
        { id: 2, course: "English", score: 78, grade: "B+", semester: "Sem 1" },
        { id: 3, course: "Physics", score: 82, grade: "A-", semester: "Sem 1" },
        { id: 4, course: "Chemistry", score: 75, grade: "B", semester: "Sem 1" },
        { id: 5, course: "Biology", score: 88, grade: "A", semester: "Sem 1" }
      ]);
      
      setUpcomingAssignments([
        { id: 1, title: "Mathematics Project", course: "Mathematics", dueDate: "Jan 10, 2025", priority: "high" },
        { id: 2, title: "English Essay", course: "English", dueDate: "Jan 15, 2025", priority: "medium" },
        { id: 3, title: "Physics Lab Report", course: "Physics", dueDate: "Jan 20, 2025", priority: "low" },
        { id: 4, title: "Chemistry Assignment", course: "Chemistry", dueDate: "Jan 25, 2025", priority: "medium" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeLetter = (score) => {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 50) return "C";
    return "F";
  };

  const getPriority = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) return "high";
    if (diffDays <= 5) return "medium";
    return "low";
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.success("Dashboard refreshed!");
  };

  const dashboardCards = [
    {
      title: "My Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      path: "/student/courses"
    },
    {
      title: "Average Grade",
      value: `${stats.averageGrade}%`,
      icon: Award,
      color: "from-green-500 to-emerald-500",
      path: "/student/results"
    },
    {
      title: "Attendance",
      value: `${stats.attendanceRate}%`,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      path: "/student/attendance"
    },
    {
      title: "Pending Tasks",
      value: stats.pendingAssignments,
      icon: Clock,
      color: "from-orange-500 to-red-500",
      path: "/student/assignments"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg opacity-70">Loading your dashboard...</p>
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
              Student Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Welcome back, {user?.name || "Student"}! Track your academic progress.
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-left"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                    <card.icon size={24} className="text-white" />
                  </div>
                  <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </div>
                
                <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
                <p className="text-sm opacity-70">{card.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Welcome Banner */}
        <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
             style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
          <div className="p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold">Keep up the great work! 🚀</p>
                <p className="text-sm opacity-90">
                  Your average grade is {stats.averageGrade}% and attendance is {stats.attendanceRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Recent Grades Section */}
          <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            
            <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-yellow-500" />
                  <h2 className="text-xl font-semibold">Recent Results</h2>
                </div>
                <button 
                  onClick={() => navigate("/student/results")}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  View All →
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentGrades.length === 0 ? (
                <div className="text-center py-8">
                  <p className="opacity-50">No grades available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    >
                      <div>
                        <p className="font-semibold">{grade.course}</p>
                        <p className="text-xs opacity-60">{grade.semester}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          grade.grade.startsWith('A') ? 'text-green-600' :
                          grade.grade.startsWith('B') ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {grade.grade}
                        </p>
                        <p className="text-xs opacity-60">{grade.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Assignments Section */}
          <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            
            <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  <h2 className="text-xl font-semibold">Upcoming Assignments</h2>
                </div>
                <button 
                  onClick={() => navigate("/student/assignments")}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  View All →
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="opacity-50">No pending assignments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{assignment.title}</p>
                        <p className="text-xs opacity-60">{assignment.course}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="opacity-50" />
                          <span className="text-sm">{assignment.dueDate}</span>
                        </div>
                        {assignment.priority === "high" && (
                          <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle size={12} />
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          
          <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold">Recent Activities</h2>
            </div>
          </div>
          
          <div className="p-6">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="opacity-50">No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      activity.color === 'green' ? 'from-green-500 to-emerald-500' :
                      activity.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
                      'from-blue-500 to-cyan-500'
                    }`}>
                      <activity.icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm opacity-70">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="opacity-50" />
                      <span className="text-xs opacity-50">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          
          <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-semibold">Quick Links</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/student/timetable")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <Calendar size={24} className="text-blue-500" />
                <span className="text-sm">Timetable</span>
              </button>
              
              <button
                onClick={() => navigate("/student/results")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <BarChart3 size={24} className="text-green-500" />
                <span className="text-sm">Results</span>
              </button>
              
              <button
                onClick={() => navigate("/student/attendance")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <CheckCircle size={24} className="text-purple-500" />
                <span className="text-sm">Attendance</span>
              </button>
              
              <button
                onClick={() => navigate("/profile")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <User size={24} className="text-orange-500" />
                <span className="text-sm">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;