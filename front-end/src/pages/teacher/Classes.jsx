import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedClasses } from "../../api/assignedService";
import AssignedStudentsTable from "../../components/teachers/AssignedStudentsTable";
import { ArrowLeft, BookOpen, Users, GraduationCap, Layers, RefreshCw, Download } from "lucide-react";
import toast from "react-hot-toast";

const Classes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssigned();
  }, []);

  const loadAssigned = async (showToast = false) => {
    try {
      const res = await getAssignedClasses();
      setData(res);
      if (showToast) {
        toast.success("Classes refreshed successfully!");
      }
    } catch (err) {
      console.error("Failed to load assigned classes", err);
      toast.error("Failed to load assigned classes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAssigned(true);
  };

  const handleExport = () => {
    const exportData = data.map(item => ({
      grade: item.classInfo.grade,
      section: item.classInfo.section,
      stream: item.classInfo.stream,
      course: item.classInfo.course,
      studentsCount: item.students.length,
      students: item.students.map(s => s.name).join(", ")
    }));
    
    const csvContent = [
      ["Grade", "Section", "Stream", "Course", "Students Count", "Students"],
      ...exportData.map(row => [row.grade, row.section, row.stream, row.course, row.studentsCount, row.students])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assigned_classes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started!");
  };

  // Calculate statistics
  const totalStudents = data.reduce((sum, item) => sum + (item.students?.length || 0), 0);
  const totalClasses = data.length;
  const uniqueCourses = [...new Set(data.map(item => item.classInfo?.course))].length;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center"
           style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your assigned classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 transition-all duration-500"
         style={{ background: "var(--bg)", color: "var(--text)" }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/teacher")}
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
              My Assigned Classes
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage your classes and students</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            disabled={data.length === 0}
            className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            style={{ 
              background: "var(--card)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
          >
            <Download size={18} />
            Export
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
            <h3 className="text-3xl font-bold mb-1">{totalClasses}</h3>
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
            <h3 className="text-3xl font-bold mb-1">{totalStudents}</h3>
            <p className="text-sm opacity-70">Total Students</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <GraduationCap size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{uniqueCourses}</h3>
            <p className="text-sm opacity-70">Unique Courses</p>
          </div>
        </div>
      </div>

      {/* No Data State */}
      {data.length === 0 ? (
        <div className="rounded-2xl shadow-lg p-12 text-center"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold">No Classes Assigned</h3>
            <p className="text-sm opacity-70 max-w-md">
              You don't have any classes assigned yet. Please contact the administrator to assign classes to you.
            </p>
            <button
              onClick={() => navigate("/teacher")}
              className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Classes List */
        <div className="space-y-6">
          {data.map((item, index) => {
            const studentsCount = item.students?.length || 0;
            const boysCount = item.students?.filter(s => s.gender === "Male" || s.sex === "Male").length || 0;
            const girlsCount = studentsCount - boysCount;
            
            return (
              <div
                key={index}
                className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {/* Class Header */}
                <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <GraduationCap size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold">
                          Grade {item.classInfo.grade} – Section {item.classInfo.section}
                        </h2>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        {item.classInfo.stream && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            <Layers size={12} />
                            {item.classInfo.stream}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          <BookOpen size={12} />
                          {item.classInfo.course}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{studentsCount}</p>
                        <p className="text-xs opacity-70">Total Students</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{boysCount}</p>
                        <p className="text-xs opacity-70">Boys</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pink-600">{girlsCount}</p>
                        <p className="text-xs opacity-70">Girls</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Students Table */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Student List
                  </h3>
                  <AssignedStudentsTable students={item.students} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Classes;