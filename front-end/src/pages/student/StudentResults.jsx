import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { getStudentReleasedResults, getStudentAcademicYears, requestGradeReview } from "../../api/gradeService";
import { 
  ArrowLeft, 
  Filter, 
  ChevronDown, 
  Award, 
  BookOpen, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MessageSquare,
  Download
} from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";

const StudentResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [reviewReason, setReviewReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedYearId) {
      fetchResults();
    }
  }, [selectedYearId, selectedSemester]);

  const fetchAcademicYears = async () => {
    try {
      const response = await getStudentAcademicYears();
      const years = response.academicYears || response.data?.academicYears || [];
      setAcademicYears(years);
      
      if (years.length > 0) {
        setSelectedYearId(years[0]._id);
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to load academic years");
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await getStudentReleasedResults(selectedYearId, selectedSemester);
      
      setStudentInfo(response.student || response.data?.student);
      setResults(response.results || response.data?.results || []);
      setSummary(response.summary || response.data?.summary);
      
      if ((response.results || response.data?.results || []).length === 0) {
        toast.error("No results released yet for this period");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchResults();
    toast.success("Results refreshed!");
  };

  const handleRequestReview = async () => {
    if (!reviewReason.trim()) {
      toast.error("Please provide a reason for review");
      return;
    }
    
    setSubmitting(true);
    try {
      await requestGradeReview(selectedGrade._id, reviewReason);
      toast.success("Review request submitted successfully!");
      setReviewModalOpen(false);
      setReviewReason("");
      setSelectedGrade(null);
    } catch (error) {
      console.error("Error requesting review:", error);
      toast.error("Failed to submit review request");
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
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

  if (loading && results.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg opacity-70">Loading your results...</p>
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/student")}
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
                My Results
              </h1>
              <p className="text-sm opacity-70 mt-1">View your academic performance</p>
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
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Student Info Card */}
        {studentInfo && (
          <div className="rounded-2xl shadow-lg p-6"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Student Name</p>
                  <p className="text-xl font-semibold">{studentInfo.name}</p>
                  <p className="text-xs opacity-60">ID: {studentInfo.username}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-sm opacity-70">Grade</p>
                  <p className="text-lg font-bold">{studentInfo.grade}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-70">Section</p>
                  <p className="text-lg font-bold">{studentInfo.section}</p>
                </div>
                {studentInfo.stream && (
                  <div className="text-center">
                    <p className="text-sm opacity-70">Stream</p>
                    <p className="text-lg font-bold">{studentInfo.stream}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Academic Year
                </label>
                <select
                  value={selectedYearId}
                  onChange={(e) => setSelectedYearId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                >
                  {academicYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.name} ({year.ethiopianYear} / {year.gregorianYear})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              <button
                onClick={fetchResults}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                         transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Filter size={18} />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="rounded-2xl shadow-lg p-12 text-center"
               style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                <AlertCircle size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold">No Results Found</h3>
              <p className="text-sm opacity-70 max-w-md">
                {selectedSemester === "1" 
                  ? "No results have been released for Semester 1 yet. Please check back later."
                  : "No results have been released for Semester 2 yet. Complete Semester 1 first."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Table */}
            <div className="rounded-2xl shadow-lg overflow-hidden"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                      <th className="p-3 border dark:border-gray-600 text-left">Course</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Mid</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Quiz</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Assignment</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Final</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Total</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Grade</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Status</th>
                      <th className="p-3 border dark:border-gray-600 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((course, idx) => (
                      <tr
                        key={course.courseId}
                        className={`transition-all duration-200 hover:scale-[1.01] ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        } hover:bg-gray-100 dark:hover:bg-gray-600`}
                      >
                        <td className="p-3 border-b dark:border-gray-600 font-semibold">
                          {course.courseName}
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">{course.mid}</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">{course.quiz}</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">{course.assignment}</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">{course.final}</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center font-semibold">
                          {course.total}
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <span className={`font-bold ${getGradeColor(course.total)}`}>
                            {getGradeLetter(course.total)}
                          </span>
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          {course.status === "Pass" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              <CheckCircle size={12} />
                              Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                              <XCircle size={12} />
                              Fail
                            </span>
                          )}
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <button
                            onClick={() => {
                              setSelectedGrade(course);
                              setReviewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 hover:scale-110"
                            title="Request Review"
                          >
                            <MessageSquare size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Card */}
            {summary && (
              <div className="rounded-2xl shadow-lg overflow-hidden"
                   style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)" }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Overall Performance Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Total Score</p>
                      <p className="text-2xl font-bold text-white">{summary.totalScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Average</p>
                      <p className={`text-2xl font-bold ${getGradeColor(parseFloat(summary.average))}`}>
                        {summary.average}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Courses Taken</p>
                      <p className="text-2xl font-bold text-white">{summary.totalCourses}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">Overall Status</p>
                      {summary.status === "Pass" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                          <CheckCircle size={14} />
                          Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">
                          <XCircle size={14} />
                          Fail
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Class Rank Info (if available) */}
            {summary?.rank && (
              <div className="rounded-2xl shadow-lg p-6 text-center"
                   style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-center gap-2">
                  <Award size={24} className="text-yellow-500" />
                  <p className="text-lg">
                    Your Class Rank: <strong>#{summary.rank}</strong>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Request Modal */}
      <DeleteConfirmModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedGrade(null);
          setReviewReason("");
        }}
        onConfirm={handleRequestReview}
        title="Request Grade Review"
        message={`Requesting review for ${selectedGrade?.courseName || "this course"}`}
        subtitle="Please provide a reason why you believe this grade should be reviewed."
        type="update"
        loading={submitting}
      >
        <div className="mt-4">
          <textarea
            className="w-full p-3 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            style={{ 
              background: "var(--bg)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
            rows="4"
            placeholder="Explain why you want this grade reviewed..."
            value={reviewReason}
            onChange={(e) => setReviewReason(e.target.value)}
          />
        </div>
      </DeleteConfirmModal>
    </Layout>
  );
};

export default StudentResults;