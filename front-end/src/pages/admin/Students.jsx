import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getStudents, deleteStudent } from "../../api/studentService";
import StudentTable from "../../components/students/StudentTable";
import { useAuth } from "../../context/AuthContext";
import { 
  Plus, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  TrendingUp,
  ChevronDown
} from "lucide-react";
import {
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
  ResponsiveContainer
} from "recharts";

export default function Students() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    username: "",
    grade: "",
    section: "",
    stream: ""
  });

  // Load students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filters.username) params.username = filters.username;
      if (filters.grade) params.grade = filters.grade;
      if (filters.section) params.section = filters.section;
      if (filters.stream) params.stream = filters.stream;

      const res = await getStudents(user.token, params);
      setStudents(res.data.students || []);
    } catch (error) {
      console.error("Failed to load students", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id, user.token);
      toast.success("Student deleted successfully!");
      loadStudents();
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/students/edit/${id}`);
  };

  const handleRefresh = () => {
    loadStudents();
    toast.success("Data refreshed!");
  };

  const handleExport = () => {
    // Export students data as CSV
    const headers = ["Name", "Username", "Grade", "Section", "Stream", "Email", "Phone"];
    const csvData = students.map(student => [
      student.name,
      student.username,
      student.grade,
      student.section,
      student.stream,
      student.email,
      student.phone
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  const clearFilters = () => {
    setFilters({
      username: "",
      grade: "",
      section: "",
      stream: ""
    });
    toast.success("Filters cleared!");
  };

  // Calculate statistics for charts
  const gradeDistribution = students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});

  const streamDistribution = students.reduce((acc, student) => {
    acc[student.stream] = (acc[student.stream] || 0) + 1;
    return acc;
  }, {});

  const sectionDistribution = students.reduce((acc, student) => {
    acc[student.section] = (acc[student.section] || 0) + 1;
    return acc;
  }, {});

  const chartColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

  const gradeChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: `Grade ${grade}`,
    students: count
  }));

  const streamChartData = Object.entries(streamDistribution).map(([stream, count]) => ({
    name: stream,
    value: count
  }));

  const statsCards = [
    { title: "Total Students", value: students.length, icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Total Grades", value: Object.keys(gradeDistribution).length, icon: GraduationCap, color: "from-green-500 to-emerald-500" },
    { title: "Total Sections", value: Object.keys(sectionDistribution).length, icon: BookOpen, color: "from-purple-500 to-pink-500" },
    { title: "Avg per Grade", value: Math.round(students.length / Object.keys(gradeDistribution).length) || 0, icon: TrendingUp, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6 transition-all duration-500"
         style={{ background: "var(--bg)", color: "var(--text)" }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage and monitor all students in the school</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <Download size={18} />
            Export
          </button>

          <button
            onClick={() => navigate("/admin/students/add")}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
            }}
          >
            <Plus size={18} /> Add Student
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
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm opacity-70">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {students.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Grade Distribution Chart */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text)"
                  }} 
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stream Distribution Chart */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Stream Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={streamChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {streamChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
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
      )}

      {/* Filters Section */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        {/* Filter Header */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex justify-between items-center p-4 transition-all duration-300"
          style={{ borderBottom: showFilters ? "1px solid var(--border)" : "none" }}
        >
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <span className="font-semibold">Filters</span>
          </div>
          <ChevronDown size={20} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Filter Content */}
        {showFilters && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  placeholder="Search by username..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={filters.username}
                  onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                />
              </div>

              <input
                placeholder="Grade (e.g., 9, 10, 11, 12)"
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
              />

              <input
                placeholder="Section (A, B, C...)"
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              />

              <select
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.stream}
                onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
              >
                <option value="">All Streams</option>
                <option value="Natural">Natural Science</option>
                <option value="Social">Social Science</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        {/* Table Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Student List</h3>
              <p className="text-sm opacity-70">Showing {students.length} students</p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={40} className="animate-spin opacity-50" />
            </div>
          ) : (
            <StudentTable
              students={students}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}