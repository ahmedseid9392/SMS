import { useEffect, useState } from "react";
import { getAllGrades, adminReleaseGrades, adminUnlockGrade, getAcademicYears, getCurrentAcademicYear } from "../../api/gradeService";
import { ArrowLeft, RefreshCw, Download, Filter, ChevronDown, Award, Users, BookOpen, GraduationCap, Lock, Unlock, FileText, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { generateReportCard } from "../../utils/generateReportCard";
import React from "react";

const GradeDashboard = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterGrade, setFilterGrade] = useState("");
  const [filterStream, setFilterStream] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const navigate = useNavigate();

  // Fetch academic years on mount
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await getAcademicYears();
      
      // Handle different response structures
      let years = [];
      if (response.data && Array.isArray(response.data)) {
        years = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        years = response.data.data;
      } else if (Array.isArray(response)) {
        years = response;
      } else if (response.data && response.data.academicYears && Array.isArray(response.data.academicYears)) {
        years = response.data.academicYears;
      }
      
      setAcademicYears(years);
      
      // Get current active academic year
      const currentYearRes = await getCurrentAcademicYear();
      
      // Handle current year response
      let currentYear = null;
      if (currentYearRes.data && currentYearRes.data.data) {
        currentYear = currentYearRes.data.data;
      } else if (currentYearRes.data) {
        currentYear = currentYearRes.data;
      }
      
      if (currentYear && currentYear._id) {
        setSelectedYearId(currentYear._id);
        setSelectedYear(currentYear);
      } else if (years.length > 0) {
        // Find active year or use first
        const activeYear = years.find(y => y.isActive === true);
        const defaultYear = activeYear || years[0];
        setSelectedYearId(defaultYear._id);
        setSelectedYear(defaultYear);
      }
    } catch (error) {
      console.error("Failed to fetch academic years:", error);
      toast.error("Failed to load academic years");
      // Set empty array to avoid map error
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch grades when academic year changes
  useEffect(() => {
    if (selectedYearId) {
      fetchGrades();
    }
  }, [selectedYearId]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await getAllGrades(selectedYearId);
      setSections(data.sections || {});
    } catch (error) {
      console.error("Failed to load grades:", error);
      toast.error("Failed to load grades");
      setSections({});
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseClick = (sectionKey, sectionData) => {
    setSelectedSection({ key: sectionKey, data: sectionData });
    setReleaseModalOpen(true);
  };

  const handleConfirmRelease = async () => {
    if (selectedSection) {
      try {
        await adminReleaseGrades(selectedSection.key, selectedYearId);
        toast.success("Grades Released Successfully!");
        setReleaseModalOpen(false);
        setSelectedSection(null);
        await fetchGrades();
      } catch (err) {
        console.error(err);
        toast.error("Failed to release grades");
      }
    }
  };

  const handleUnlockClick = (gradeId, studentName) => {
    setSelectedGrade({ id: gradeId, name: studentName });
    setUnlockModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (selectedGrade) {
      try {
        await adminUnlockGrade(selectedGrade.id);
        toast.success("Grade unlocked successfully!");
        setUnlockModalOpen(false);
        setSelectedGrade(null);
        await fetchGrades();
      } catch (error) {
        console.error("Unlock failed:", error);
        toast.error("Failed to unlock grade");
      }
    }
  };

  const handleRefresh = async () => {
    await fetchGrades();
    toast.success("Data refreshed!");
  };

  const handleExport = () => {
    toast.success("Export feature coming soon!");
  };

  // Filter sections based on selected filters
  const filteredSections = Object.entries(sections).filter(([key, sec]) => {
    if (filterGrade && sec.meta.grade != filterGrade) return false;
    if (filterStream && sec.meta.stream !== filterStream) return false;
    return true;
  });

  // Calculate statistics
  const calculateStats = () => {
    let totalStudents = 0;
    let totalPassing = 0;
    let totalSections = 0;

    filteredSections.forEach(([key, sectionData]) => {
      totalSections++;
      totalStudents += sectionData.students?.length || 0;
      totalPassing += sectionData.students?.filter(s => s.status === "Pass").length || 0;
    });

    return { 
      totalStudents, 
      totalPassing, 
      totalSections, 
      passRate: totalStudents ? ((totalPassing / totalStudents) * 100).toFixed(1) : 0 
    };
  };

  const stats = calculateStats();

  if (loading && academicYears.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center"
           style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading grade dashboard...</p>
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
              Grade Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage and monitor student grades</p>
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
            <RefreshCw size={18} />
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
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
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <Award size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.passRate}%</h3>
            <p className="text-sm opacity-70">Pass Rate</p>
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
            <h3 className="text-3xl font-bold mb-1">{stats.totalSections}</h3>
            <p className="text-sm opacity-70">Active Sections</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalPassing}</h3>
            <p className="text-sm opacity-70">Passing Students</p>
          </div>
        </div>
      </div>

      {/* Academic Year and Filters Section */}
      <div className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Academic Year Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                <label className="font-semibold">Academic Year:</label>
              </div>
              <select
                value={selectedYearId}
                onChange={(e) => {
                  const yearId = e.target.value;
                  setSelectedYearId(yearId);
                  const year = academicYears.find(y => y._id === yearId);
                  setSelectedYear(year);
                }}
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
              >
                {academicYears.length === 0 ? (
                  <option value="">No academic years available</option>
                ) : (
                  academicYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.name} ({year.ethiopianYear} / {year.gregorianYear})
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300"
              style={{ 
                background: "var(--bg)", 
                border: "1px solid var(--border)" 
              }}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <select
                className="px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
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
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
              >
                <option value="">All Streams</option>
                <option value="Natural">Natural Science</option>
                <option value="Social">Social Science</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Academic Year Info Banner */}
      {selectedYear && (
        <div className="rounded-2xl shadow-lg p-4"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Currently Viewing: {selectedYear.name}</p>
              <p className="text-xs opacity-70">
                Ethiopian: {selectedYear.ethiopianYear} | Gregorian: {selectedYear.gregorianYear}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="rounded-2xl shadow-lg p-12 text-center"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <BookOpen size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold">No Sections Found</h3>
            <p className="text-sm opacity-70">
              No grade data available for the selected academic year and filters.
            </p>
          </div>
        </div>
      ) : (
        filteredSections.map(([key, sectionData]) => {
          const { meta, students } = sectionData;
          const courseNames = Object.keys(meta.courses);

          const topThree = [...students]
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 3);

          return (
            <div key={key} className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              
              {/* Section Header */}
              <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Grade {meta.grade} | {meta.stream} | Section {meta.section}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {courseNames.map((course) => (
                        <span key={course} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          <BookOpen size={12} />
                          {course} — {meta.courses[course]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleReleaseClick(key, sectionData)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium
                             transition-all duration-200 hover:scale-105 flex items-center gap-2"
                  >
                    <Unlock size={16} />
                    Release Grades
                  </button>
                </div>
              </div>

              {/* Top 3 Students */}
              {topThree.length > 0 && (
                <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-500" />
                    Top 3 Students
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topThree.map((student, idx) => (
                      <div key={student.studentId} 
                           className="p-4 rounded-xl transition-all duration-300 hover:scale-105 text-center"
                           style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                        <div className="text-3xl font-bold text-yellow-500 mb-2">#{student.rank}</div>
                        <p className="font-semibold">{student.fullName}</p>
                        <p className="text-sm opacity-70">Total: {student.finalSum.toFixed(2)}</p>
                        <p className="text-sm opacity-70">Average: {student.average.toFixed(2)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grades Table */}
              <div className="overflow-x-auto p-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-left">Student</th>
                      {courseNames.map((course) => (
                        <th key={course} colSpan="3" className="p-3 border dark:border-gray-600 text-center">
                          {course}
                        </th>
                      ))}
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-center">Total</th>
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-center">Average</th>
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-center">Rank</th>
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-center">Status</th>
                      <th rowSpan="2" className="p-3 border dark:border-gray-600 text-center">Actions</th>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      {courseNames.map((course) => (
                        <React.Fragment key={course}>
                          <th className="p-2 border dark:border-gray-600 text-center text-xs">Sem 1</th>
                          <th className="p-2 border dark:border-gray-600 text-center text-xs">Sem 2</th>
                          <th className="p-2 border dark:border-gray-600 text-center text-xs">Avg</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={student.studentId} 
                          className={`transition-all duration-200 hover:scale-[1.01] ${
                            idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"
                          } hover:bg-gray-100 dark:hover:bg-gray-600`}>
                        <td className="p-3 border-b dark:border-gray-600 font-medium">{student.fullName}</td>

                        {courseNames.map((course) => {
                          const c = student.courses[course] || { sem1Total: 0, sem2Total: 0, AVG: 0 };
                          return (
                            <React.Fragment key={course}>
                              <td className="p-3 border-b dark:border-gray-600 text-center">{c.sem1Total}</td>
                              <td className="p-3 border-b dark:border-gray-600 text-center">{c.sem2Total}</td>
                              <td className="p-3 border-b dark:border-gray-600 text-center font-semibold">{c.AVG}</td>
                            </React.Fragment>
                          );
                        })}

                        <td className="p-3 border-b dark:border-gray-600 text-center font-semibold">{student.finalSum.toFixed(2)}</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">{student.average.toFixed(2)}%</td>
                        <td className="p-3 border-b dark:border-gray-600 text-center font-bold">#{student.rank}</td>
                        <td className={`p-3 border-b dark:border-gray-600 text-center font-bold ${
                          student.status === "Pass" ? "text-green-600" : "text-red-600"
                        }`}>
                          {student.status}
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => generateReportCard(student, meta)}
                              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                              title="Generate Report Card"
                            >
                              <FileText size={16} />
                            </button>
                            <button
                              onClick={() => handleUnlockClick(student.gradeId, student.fullName)}
                              className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 hover:scale-110"
                              title="Unlock Grade"
                            >
                              <Lock size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {/* Release Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={releaseModalOpen}
        onClose={() => {
          setReleaseModalOpen(false);
          setSelectedSection(null);
        }}
        onConfirm={handleConfirmRelease}
        title="Release Grades"
        message="Are you sure you want to release grades for this section?"
        subtitle={`Grade ${selectedSection?.data?.meta?.grade} | ${selectedSection?.data?.meta?.stream} | Section ${selectedSection?.data?.meta?.section}`}
        type="update"
      />

      {/* Unlock Grade Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={unlockModalOpen}
        onClose={() => {
          setUnlockModalOpen(false);
          setSelectedGrade(null);
        }}
        onConfirm={handleConfirmUnlock}
        title="Unlock Grade"
        message={`Are you sure you want to unlock grades for ${selectedGrade?.name}?`}
        subtitle="Student will be able to view and request changes to their grades."
        type="update"
      />
    </div>
  );
};

export default GradeDashboard;