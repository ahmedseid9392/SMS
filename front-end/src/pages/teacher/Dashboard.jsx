import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import ThemedCard from "../../components/ui/ThemedCard";
import { useAuth } from "../../context/AuthContext";
import { getAssignedClasses } from "../../api/assignedService";
import { getTeacherGrades } from "../../api/gradeService";
import { 
  BookOpen, 
  CheckSquare, 
  FileEdit, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    submittedGrades: 0,
    pendingGrades: 0,
    attendanceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load assigned classes
      const classesRes = await getAssignedClasses();
      const classes = classesRes.data || classesRes || [];
      setAssignedClasses(classes);
      
      // Load grades
      const gradesRes = await getTeacherGrades();
      const grades = gradesRes.grades || gradesRes.data?.grades || [];
      
      // Calculate statistics
      let totalStudents = 0;
      let submittedCount = 0;
      let pendingCount = 0;
      
      classes.forEach(cls => {
        totalStudents += cls.students?.length || 0;
      });
      
      grades.forEach(grade => {
        if (grade.sem1?.locked) submittedCount++;
        else if (grade.sem1?.mid || grade.sem1?.quiz) pendingCount++;
      });
      
      setStats({
        totalClasses: classes.length,
        totalStudents,
        submittedGrades: submittedCount,
        pendingGrades: pendingCount,
        attendanceRate: 94 // You can calculate from actual attendance data
      });
      
      // Set recent activities
      const activities = [];
      const today = new Date();
      
      if (classes.length > 0) {
        activities.push({
          id: 1,
          title: "Classes Assigned",
          description: `You have ${classes.length} class${classes.length > 1 ? 'es' : ''} to teach`,
          time: "Today",
          icon: BookOpen,
          color: "blue"
        });
      }
      
      if (pendingCount > 0) {
        activities.push({
          id: 2,
          title: "Grades Pending",
          description: `${pendingCount} grade${pendingCount > 1 ? 's are' : ' is'} pending submission`,
          time: "Urgent",
          icon: FileEdit,
          color: "yellow"
        });
      }
      
      if (submittedCount > 0) {
        activities.push({
          id: 3,
          title: "Grades Submitted",
          description: `${submittedCount} grade${submittedCount > 1 ? 's have' : ' has'} been submitted`,
          time: "Completed",
          icon: CheckSquare,
          color: "green"
        });
      }
      
      setRecentActivities(activities);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.success("Dashboard refreshed!");
  };

  const dashboardCards = [
    {
      title: "My Classes",
      description: "View and manage your classes",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bgColor: "blue",
      path: "/teacher/classes",
      stats: stats.totalClasses,
      statLabel: "Assigned Classes"
    },
    {
      title: "Take Attendance",
      description: "Mark daily attendance",
      icon: CheckSquare,
      color: "from-green-500 to-emerald-500",
      bgColor: "green",
      path: "/teacher/attendance",
      stats: `${stats.attendanceRate}%`,
      statLabel: "Today's Attendance"
    },
    {
      title: "Enter Grades",
      description: "Record student results",
      icon: FileEdit,
      color: "from-purple-500 to-pink-500",
      bgColor: "purple",
      path: "/teacher/grades",
      stats: stats.submittedGrades,
      statLabel: "Grades Submitted"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg opacity-70">Loading dashboard...</p>
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
              Teacher Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Welcome back, {user?.name || "Teacher"}! Here's your teaching summary.
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
          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalClasses}</h3>
              <p className="text-sm opacity-70">Total Classes</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <Users size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalStudents}</h3>
              <p className="text-sm opacity-70">Total Students</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.submittedGrades}</h3>
              <p className="text-sm opacity-70">Grades Submitted</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.pendingGrades}</h3>
              <p className="text-sm opacity-70">Pending Grades</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards - Navigation */}
        <div className="grid md:grid-cols-3 gap-6">
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
                    <card.icon size={28} className="text-white" />
                  </div>
                  <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm opacity-70 mb-3">{card.description}</p>
                
                <div className="flex items-center justify-between mt-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <span className="text-2xl font-bold">{card.stats}</span>
                  <span className="text-xs opacity-50">{card.statLabel}</span>
                </div>
              </div>
            </button>
          ))}
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
                      activity.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      activity.color === 'green' ? 'from-green-500 to-emerald-500' :
                      'from-yellow-500 to-orange-500'
                    }`}>
                      <activity.icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm opacity-70">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="opacity-50" />
                      <span className="text-xs opacity-50">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          
          <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedClasses.slice(0, 3).map((cls, index) => (
                <button
                  key={index}
                  onClick={() => navigate("/teacher/grades")}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  <div className="text-left">
                    <p className="font-semibold">
                      Grade {cls.classInfo?.grade} - Section {cls.classInfo?.section}
                    </p>
                    <p className="text-xs opacity-70">{cls.classInfo?.course}</p>
                  </div>
                  <ChevronRight size={18} className="opacity-50" />
                </button>
              ))}
              
              {assignedClasses.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="opacity-50">No classes assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;