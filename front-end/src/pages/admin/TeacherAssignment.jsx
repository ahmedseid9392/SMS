import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, RefreshCw, Download, Filter, ChevronDown, BookOpen, Users, GraduationCap } from "lucide-react";
import AssignmentTable from "../../components/Assignment/AssignmentTable";
import { getAssignments, deleteAssignment } from "../../api/TeacherAssignmentService";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import toast from "react-hot-toast";

const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    grade: "",
    section: "",
    stream: ""
  });
  
  const navigate = useNavigate();

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAssignments();
      console.log("Assignments Loaded:", data);
      setAssignments(Array.isArray(data) ? data : []);
      toast.success("Assignments loaded successfully");
    } catch (err) {
      console.error("Load error:", err);
      toast.error("Failed to load assignments");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDeleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAssignment) {
      try {
        await deleteAssignment(selectedAssignment._id);
        toast.success("Assignment deleted successfully!");
        loadAssignments();
        setDeleteModalOpen(false);
        setSelectedAssignment(null);
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/assignment/edit/${id}`);
  };

  const handleRefresh = () => {
    loadAssignments();
  };

  const handleExport = () => {
    const headers = ["Grade", "Section", "Stream", "Course", "Teacher"];
    const csvData = filteredAssignments.map(assignment => {
      const a = assignment.assignment || assignment;
      return [
        a.grade || "N/A",
        a.section || "N/A",
        a.stream || "N/A",
        a.course?.name || "N/A",
        a.teacher?.fullName || "N/A"
      ];
    });
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assignments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  const clearFilters = () => {
    setFilters({ grade: "", section: "", stream: "" });
    toast.success("Filters cleared!");
  };

  // Apply filters
  const filteredAssignments = assignments.filter(assignment => {
    const a = assignment.assignment || assignment;
    if (filters.grade && a.grade !== parseInt(filters.grade)) return false;
    if (filters.section && a.section !== filters.section) return false;
    if (filters.stream && a.stream !== filters.stream) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    grades: [...new Set(assignments.map(a => {
      const item = a.assignment || a;
      return item.grade;
    }).filter(Boolean))].length,
    teachers: [...new Set(assignments.map(a => {
      const item = a.assignment || a;
      return item.teacher?._id;
    }).filter(Boolean))].length
  };

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
              Teacher Assignments
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage teacher to course assignments</p>
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
            onClick={() => navigate("/admin/assignment/add")}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
            }}
          >
            <Plus size={18} /> Assign Teacher
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
            <p className="text-sm opacity-70">Total Assignments</p>
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
                <Users size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.teachers}</h3>
            <p className="text-sm opacity-70">Teachers Assigned</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
              >
                <option value="">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>

              <input
                placeholder="Section (e.g., A, B, C)"
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

      {/* Assignments Table */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Assignment List</h3>
              <p className="text-sm opacity-70">Showing {filteredAssignments.length} assignments</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <AssignmentTable
            assignments={filteredAssignments}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAssignment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete this assignment?`}
        subtitle={`Grade ${selectedAssignment?.grade} - Section ${selectedAssignment?.section} - ${selectedAssignment?.course?.name || ""}`}
        type="delete"
      />
    </div>
  );
};

export default TeacherAssignment;