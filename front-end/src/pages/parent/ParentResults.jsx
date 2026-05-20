import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../api/axios";
import { getParentAcademicYears, getParentReleasedResults } from "../../api/gradeService";
import { ArrowLeft, Award, BookOpen, Calendar, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const ParentResults = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [studentInfo, setStudentInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      loadAcademicYears(selectedChildId);
    }
  }, [selectedChildId]);

  useEffect(() => {
    if (selectedChildId && selectedYearId) {
      loadResults();
    }
  }, [selectedChildId, selectedYearId, selectedSemester]);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const response = await api.get("/parent/children");
      const list = response.data.data || [];
      setChildren(list);
      if (list.length > 0) {
        setSelectedChildId(list[0]._id);
      }
    } catch (error) {
      console.error("Error loading parent children:", error);
      toast.error("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const loadAcademicYears = async (studentId) => {
    try {
      const response = await getParentAcademicYears(studentId);
      const years = response.academicYears || [];
      setAcademicYears(years);
      setSelectedYearId(years[0]?._id || "");
    } catch (error) {
      console.error("Error loading parent academic years:", error);
      toast.error("Failed to load academic years");
    }
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const response = await getParentReleasedResults(selectedChildId, selectedYearId, selectedSemester);
      setStudentInfo(response.student || null);
      setResults(response.results || []);
      setSummary(response.summary || null);
    } catch (error) {
      console.error("Error loading parent results:", error);
      toast.error("Failed to load results");
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

  if (loading && children.length === 0) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg opacity-70">Loading child results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/parent")}
              className="rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <span className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Back
              </span>
            </button>
            <div>
              <h1 className="text-3xl font-bold">Child Results</h1>
              <p className="text-muted mt-1 text-sm">Review released academic results for your linked child.</p>
            </div>
          </div>

          <button
            onClick={loadResults}
            className="rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            <span className="flex items-center gap-2">
              <RefreshCw size={18} />
              Refresh
            </span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Child</label>
            <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Academic Year</label>
            <select value={selectedYearId} onChange={(e) => setSelectedYearId(e.target.value)}>
              {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Semester</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        {studentInfo && (
          <div className="surface-card rounded-[1.6rem] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-white">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-muted text-sm">Student Name</p>
                  <p className="text-xl font-semibold">{studentInfo.name}</p>
                  <p className="text-muted text-xs">ID: {studentInfo.username}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-muted text-sm">Grade</p>
                  <p className="text-lg font-bold">{studentInfo.grade}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted text-sm">Section</p>
                  <p className="text-lg font-bold">{studentInfo.section}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="surface-card overflow-hidden rounded-[1.6rem]">
          <div className="border-b p-5" style={{ borderColor: "var(--border)" }}>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Calendar size={20} />
              Released Results
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-center">Mid</th>
                  <th className="p-3 text-center">Quiz</th>
                  <th className="p-3 text-center">Assignment</th>
                  <th className="p-3 text-center">Final</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-muted">
                      No released results found for this child in the selected period.
                    </td>
                  </tr>
                ) : (
                  results.map((course) => (
                    <tr key={course.courseId} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="p-3 font-semibold">{course.courseName}</td>
                      <td className="p-3 text-center">{course.mid}</td>
                      <td className="p-3 text-center">{course.quiz}</td>
                      <td className="p-3 text-center">{course.assignment}</td>
                      <td className="p-3 text-center">{course.final}</td>
                      <td className="p-3 text-center font-semibold">{course.total}</td>
                      <td className="p-3 text-center font-bold">{getGradeLetter(course.total)}</td>
                      <td className="p-3 text-center">
                        {course.status === "Pass" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle size={12} />
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-900 dark:text-red-300">
                            <XCircle size={12} />
                            Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {summary && (
          <div className="rounded-[1.6rem] bg-slate-900 p-6 text-white shadow-xl">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Award size={20} />
              Performance Summary
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-300">Total Score</p>
                <p className="mt-1 text-2xl font-bold">{summary.totalScore}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Average</p>
                <p className="mt-1 text-2xl font-bold">{summary.average}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Courses</p>
                <p className="mt-1 text-2xl font-bold">{summary.totalCourses}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Status</p>
                <p className="mt-1 text-2xl font-bold">{summary.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ParentResults;
