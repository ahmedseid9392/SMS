import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTeachers, deleteTeacher } from "../../api/teacherService";
import TeacherTable from "../../components/teachers/TeacherTable";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { 
  Plus, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ChevronDown,
  UserPlus
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

export default function Teachers() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [filters, setFilters] = useState({
    name: "",
    subject: "",
    qualification: "",
  });

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const params = {};

      if (filters.name) params.name = filters.name;
      if (filters.subject) params.subject = filters.subject;
      if (filters.qualification) params.qualification = filters.qualification;

      const res = await getTeachers(user.token, params);
      setTeachers(res.data.teachers || []);
    } catch (error) {
      toast.error("Failed to load teachers");
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [filters]);

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTeacher) {
      await deleteTeacher(selectedTeacher._id, user.token);
      toast.success("Teacher deleted successfully");
      setDeleteModalOpen(false);
      setSelectedTeacher(null);
      loadTeachers();
    }
  };

  const handleRefresh = () => {
    loadTeachers();
    toast.success("Data refreshed!");
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Subject", "Qualification", "Phone", "Address"];
    const csvData = teachers.map(teacher => [
      teacher.name,
      teacher.email,
      teacher.subject,
      teacher.qualification,
      teacher.phone,
      teacher.address
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      subject: "",
      qualification: "",
    });
    toast.success("Filters cleared!");
  };

  // Calculate statistics for charts
  const subjectDistribution = teachers.reduce((acc, teacher) => {
    acc[teacher.subject] = (acc[teacher.subject] || 0) + 1;
    return acc;
  }, {});

  const qualificationDistribution = teachers.reduce((acc, teacher) => {
    acc[teacher.qualification] = (acc[teacher.qualification] || 0) + 1;
    return acc;
  }, {});

  const chartColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

  const subjectChartData = Object.entries(subjectDistribution).map(([subject, count]) => ({
    name: subject,
    teachers: count
  }));

  const qualificationChartData = Object.entries(qualificationDistribution).map(([qualification, count]) => ({
    name: qualification,
    value: count
  }));

  const statsCards = [
    { 
      title: "Total Teachers", 
      value: teachers.length, 
      icon: Users, 
      color: "from-blue-500 to-cyan-500",
      subtitle: "Active faculty members"
    },
    { 
      title: "Subjects", 
      value: Object.keys(subjectDistribution).length, 
      icon: BookOpen, 
      color: "from-green-500 to-emerald-500",
      subtitle: "Different subjects"
    },
    { 
      title: "Avg Classes", 
      value: Math.round(teachers.reduce((acc, t) => acc + (t.classesCount || 0), 0) / teachers.length) || 0, 
      icon: Award, 
      color: "from-purple-500 to-pink-500",
      subtitle: "Per teacher"
    },
    { 
      title: "Qualified", 
      value: `${Math.round((teachers.filter(t => t.qualification === "Master's Degree").length / teachers.length) * 100)}%` || "0%", 
      icon: TrendingUp, 
      color: "from-orange-500 to-red-500",
      subtitle: "Master's degree"
    },
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
              Teacher Management
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage and monitor all teaching staff</p>
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
            onClick={() => navigate("/admin/teachers/add")}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
            }}
          >
            <UserPlus size={18} /> Add Teacher
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
              <p className="text-xs opacity-50 mt-1">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {teachers.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject Distribution Chart */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Subject Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectChartData}>
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
                <Bar dataKey="teachers" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Qualification Distribution Chart */}
          <div className="rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-xl font-semibold mb-4">Qualification Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualificationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualificationChartData.map((entry, index) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                <input
                  placeholder="Subject..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                />
              </div>

              <select
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.qualification}
                onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
              >
                <option value="">All Qualifications</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
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

      {/* Teachers Table */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        {/* Table Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Teacher List</h3>
              <p className="text-sm opacity-70">Showing {teachers.length} teachers</p>
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
            <TeacherTable 
              teachers={teachers} 
              onDelete={handleDeleteClick}
              onEdit={(id) => navigate(`/admin/teachers/edit/${id}`)}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTeacher(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.name}?`}
        subtitle="This action cannot be undone. All teacher data including assigned classes and courses will be permanently removed."
        type="delete"
      />
    </div>
  );
}