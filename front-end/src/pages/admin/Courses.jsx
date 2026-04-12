import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../../api/courseService";
import { ArrowLeft, Plus, RefreshCw, Download, Filter, ChevronDown, BookOpen, GraduationCap, Layers } from "lucide-react";
import CourseTable from "../../components/courses/CourseTable";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import toast from "react-hot-toast";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filters, setFilters] = useState({
    gradeLevel: "",
    stream: ""
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load courses", err);
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCourse) {
      try {
        await deleteCourse(selectedCourse._id);
        toast.success("Course deleted successfully!");
        loadCourses();
        setDeleteModalOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        toast.error("Failed to delete course");
        console.error(error);
      }
    }
  };

  const handleEdit = (course) => {
    navigate(`/admin/courses/edit/${course._id}`);
  };

  const handleRefresh = () => {
    loadCourses();
    toast.success("Data refreshed!");
  };

  const handleExport = () => {
    const headers = ["Course Name", "Grade Level", "Stream"];
    const csvData = courses.map(course => [
      course.name,
      course.gradeLevel,
      course.stream || "N/A"
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `courses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  const clearFilters = () => {
    setFilters({ gradeLevel: "", stream: "" });
    toast.success("Filters cleared!");
  };

  // Apply filters
  const filteredCourses = courses.filter(course => {
    if (filters.gradeLevel && course.gradeLevel !== parseInt(filters.gradeLevel)) return false;
    if (filters.stream && course.stream !== filters.stream) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: courses.length,
    grades: [...new Set(courses.map(c => c.gradeLevel))].length,
    streams: [...new Set(courses.map(c => c.stream).filter(s => s))].length
  };

  useEffect(() => {
    loadCourses();
  }, []);

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
              Course Management
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage all courses across different grades</p>
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
            onClick={() => navigate("/admin/courses/add")}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
            }}
          >
            <Plus size={18} /> Add Course
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <BookOpen size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
            <p className="text-sm opacity-70">Total Courses</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <GraduationCap size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.grades}</h3>
            <p className="text-sm opacity-70">Grade Levels</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Layers size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.streams}</h3>
            <p className="text-sm opacity-70">Streams Available</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
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

        {showFilters && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.gradeLevel}
                onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
              >
                <option value="">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

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

      {/* Courses Table */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Course List</h3>
              <p className="text-sm opacity-70">Showing {filteredCourses.length} courses</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw size={40} className="animate-spin opacity-50" />
            </div>
          ) : (
            <CourseTable
              courses={filteredCourses}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.name}"?`}
        subtitle="This action cannot be undone. All course data will be permanently removed."
        type="delete"
      />
    </div>
  );
};

export default Courses;