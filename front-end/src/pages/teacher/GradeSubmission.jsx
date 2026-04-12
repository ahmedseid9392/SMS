import { useEffect, useState } from "react";
import { getAssignedStudents, getGradingSetting } from "../../api/gradeService";
import GradeEntryTable from "../../components/teachers/GradeEntryTable";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, GraduationCap, Layers, CheckCircle, RefreshCw, ChevronRight, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

export default function GradeSubmission() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [weights, setWeights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const studentsRes = await getAssignedStudents();
      const weightRes = await getGradingSetting();

      setClasses(studentsRes.data || []);
      setWeights(weightRes.data?.setting || null);
      
      if (studentsRes.data?.length === 0) {
        toast.error("No classes assigned to you");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    toast.success(`Selected: Grade ${cls.classInfo.grade} - Section ${cls.classInfo.section}`);
  };

  const handleBack = () => {
    setSelectedClass(null);
  };

  const handleRefresh = () => {
    loadData();
    setSelectedClass(null);
  };

  // Calculate statistics
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0);
  const totalClasses = classes.length;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center"
           style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your classes...</p>
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
              Grade Submission
            </h1>
            <p className="text-sm opacity-70 mt-1">Enter and manage student grades</p>
          </div>
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
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards (when no class selected) */}
      {!selectedClass && (
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
              <p className="text-sm opacity-70">Assigned Classes</p>
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
                  <ClipboardList size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{weights ? "Active" : "Not Set"}</h3>
              <p className="text-sm opacity-70">Grading System</p>
            </div>
          </div>
        </div>
      )}

      {/* Class Selection Section */}
      {!selectedClass ? (
        <>
          {classes.length === 0 ? (
            <div className="rounded-2xl shadow-lg p-12 text-center"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold">No Classes Assigned</h3>
                <p className="text-sm opacity-70 max-w-md">
                  You don't have any classes assigned yet. Please contact the administrator.
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap size={22} />
                Select a Class
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls, index) => {
                  const studentsCount = cls.students?.length || 0;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectClass(cls)}
                      className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ 
                        background: "var(--card)", 
                        border: "1px solid var(--border)" 
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <GraduationCap size={20} className="text-white" />
                        </div>
                        <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                      </div>
                      
                      <h3 className="text-lg font-bold mb-1">
                        Grade {cls.classInfo.grade} - Section {cls.classInfo.section}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cls.classInfo.stream && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            <Layers size={10} />
                            {cls.classInfo.stream}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          <BookOpen size={10} />
                          {cls.classInfo.course}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm opacity-70">
                        <Users size={14} />
                        <span>{studentsCount} Student{studentsCount !== 1 ? 's' : ''}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Grade Entry Section */
        <div className="space-y-4">
          {/* Selected Class Header */}
          <div className="rounded-2xl shadow-lg overflow-hidden"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold">
                      Grade {selectedClass.classInfo.grade} – Section {selectedClass.classInfo.section}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.classInfo.stream && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        <Layers size={12} />
                        {selectedClass.classInfo.stream}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      <BookOpen size={12} />
                      {selectedClass.classInfo.course}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      <Users size={12} />
                      {selectedClass.students?.length || 0} Students
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                >
                  <ArrowLeft size={18} />
                  Change Class
                </button>
              </div>
            </div>
            
            {/* Grade Entry Table */}
            {weights && (
              <div className="p-6">
                <GradeEntryTable 
                  selectedClass={selectedClass} 
                  weights={weights} 
                  onSuccess={() => {
                    toast.success("Grades saved successfully!");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}