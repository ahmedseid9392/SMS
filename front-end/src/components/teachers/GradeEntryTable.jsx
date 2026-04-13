import { useState, useEffect } from "react";
import {
  submitFinalGrade,
  saveGradeDraft,
  getGradesForClass,
  getSemesterTotals,
  getCurrentAcademicYear,
  getAllAcademicYears,
} from "../../api/gradeService";
import { toast } from "react-hot-toast";
import { Calendar, AlertCircle, CheckCircle, BookOpen, Users, Save, Send, RefreshCw, Lock } from "lucide-react";

export default function GradeEntryTable({ selectedClass, weights, onSuccess }) {
  const [grades, setGrades] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [semesterExtras, setSemesterExtras] = useState({});
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState({});
  const [submitting, setSubmitting] = useState({});

  const students = selectedClass?.students || [];

  // Fetch academic years
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAllAcademicYears();
      const years = response.data || [];
      setAcademicYears(years);
      
      const currentYearRes = await getCurrentAcademicYear();
      const currentYear = currentYearRes.data;
      setAcademicYear(currentYear);
      setSelectedYearId(currentYear?._id || (years[0]?._id || ""));
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to load academic year");
    }
  };

  const isSemesterActive = () => {
    if (!academicYear) return true;
    const semesterData = academicYear.semesters?.find(s => s.semester === selectedSemester);
    return semesterData?.isActive !== false;
  };

  const getSemesterStatus = () => {
    if (!academicYear) return { isActive: true, message: "" };
    const semesterData = academicYear.semesters?.find(s => s.semester === selectedSemester);
    if (!semesterData?.isActive) {
      return { 
        isActive: false, 
        message: `⚠️ Semester ${selectedSemester} is not active for ${academicYear.name}. Grade submission is disabled.` 
      };
    }
    return { isActive: true, message: "" };
  };

  const handleChange = (studentId, field, value) => {
    const semesterStatus = getSemesterStatus();
    if (!semesterStatus.isActive) {
      toast.error(semesterStatus.message);
      return;
    }
    
    // Don't allow changes if already submitted
    if (submitted[studentId]) {
      toast.error("Grade already submitted. Cannot modify.");
      return;
    }
    
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  const calculateTotal = (scores) => {
    if (!scores) return 0;

    const MAX = {
      mid: weights.midWeight,
      quiz: weights.quizWeight,
      assignment: weights.assignmentWeight,
      final: weights.finalWeight,
    };

    if (
      (scores.mid !== "" && scores.mid > MAX.mid) ||
      (scores.quiz !== "" && scores.quiz > MAX.quiz) ||
      (scores.assignment !== "" && scores.assignment > MAX.assignment) ||
      (scores.final !== "" && scores.final > MAX.final)
    ) {
      return "Invalid";
    }

    const total =
      (scores.mid || 0) +
      (scores.quiz || 0) +
      (scores.assignment || 0) +
      (scores.final || 0);

    return Number(total.toFixed(2));
  };

  // Load saved grades
  const loadGrades = async () => {
    if (!selectedClass || !selectedYearId) return;

    setLoading(true);
    try {
      const response = await getGradesForClass(
        selectedClass.classInfo.courseId,
        selectedYearId
      );
      
      let savedGrades = [];
      if (response.grades) {
        savedGrades = response.grades;
      } else if (response.data?.grades) {
        savedGrades = response.data.grades;
      } else if (Array.isArray(response)) {
        savedGrades = response;
      } else if (response.data && Array.isArray(response.data)) {
        savedGrades = response.data;
      }

      console.log("Loaded grades from API:", savedGrades);

      const loaded = {};
      const submittedMap = {};

      for (const gradeRecord of savedGrades) {
        const studentId = gradeRecord.student?._id || gradeRecord.student;
        const semKey = selectedSemester === 1 ? "sem1" : "sem2";
        
        // CRITICAL: Check if the grade is LOCKED/SUBMITTED first
        if (gradeRecord[semKey] && gradeRecord[semKey].locked === true) {
          // This is a SUBMITTED grade - read only
          loaded[studentId] = {
            mid: gradeRecord[semKey].mid ?? "",
            quiz: gradeRecord[semKey].quiz ?? "",
            assignment: gradeRecord[semKey].assignment ?? "",
            final: gradeRecord[semKey].final ?? "",
            total: gradeRecord[semKey].total ?? 0,
            isSubmitted: true,
            isDraft: false,
          };
          submittedMap[studentId] = true;
          console.log(`✅ Loaded SUBMITTED grade for student ${studentId}:`, loaded[studentId]);
        } 
        // Check for draft grades (only if not submitted)
        else if (gradeRecord.draft && gradeRecord.draft.semester === selectedSemester && !gradeRecord[semKey]?.locked) {
          loaded[studentId] = {
            mid: gradeRecord.draft.mid ?? "",
            quiz: gradeRecord.draft.quiz ?? "",
            assignment: gradeRecord.draft.assignment ?? "",
            final: gradeRecord.draft.final ?? "",
            total: gradeRecord.draft.total ?? 0,
            isSubmitted: false,
            isDraft: true,
          };
          submittedMap[studentId] = false;
          console.log(`📝 Loaded DRAFT grade for student ${studentId}:`, loaded[studentId]);
        }
        // Check for unlocked but existing grades (treat as editable)
        else if (gradeRecord[semKey] && !gradeRecord[semKey].locked) {
          loaded[studentId] = {
            mid: gradeRecord[semKey].mid ?? "",
            quiz: gradeRecord[semKey].quiz ?? "",
            assignment: gradeRecord[semKey].assignment ?? "",
            final: gradeRecord[semKey].final ?? "",
            total: gradeRecord[semKey].total ?? 0,
            isSubmitted: false,
            isDraft: false,
          };
          submittedMap[studentId] = false;
          console.log(`📝 Loaded UNLOCKED grade for student ${studentId}:`, loaded[studentId]);
        }

        // Load semester totals for sem2 view
        if (selectedSemester === 2) {
          try {
            const totals = await getSemesterTotals(
              studentId,
              selectedClass.classInfo.courseId,
              selectedYearId
            );
            setSemesterExtras(prev => ({
              ...prev,
              [studentId]: {
                sem1Total: totals.sem1 ?? 0,
                sem2Total: totals.sem2 ?? 0,
                average: totals.average ?? 0,
              }
            }));
          } catch (err) {
            console.error("Error loading semester totals:", err);
          }
        }
      }

      setGrades(loaded);
      setSubmitted(submittedMap);
      
      console.log("Final grades state:", loaded);
      console.log("Final submitted state:", submittedMap);
      
    } catch (err) {
      console.error("LOAD ERROR:", err);
      toast.error("Failed to load saved grades");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadGrades();
    toast.success("Refreshing grades...");
  };

  useEffect(() => {
    loadGrades();
  }, [selectedClass, selectedSemester, selectedYearId]);

  const handleSubmitFinal = async (student) => {
    const semesterStatus = getSemesterStatus();
    if (!semesterStatus.isActive) {
      toast.error(semesterStatus.message);
      return;
    }

    const currentGrades = grades[student._id];
    
    if (!currentGrades) {
      toast.error("No grades found for this student");
      return;
    }

    if (submitted[student._id]) {
      toast.error("Already submitted");
      return;
    }

    // Check if all fields have values
    if (
      currentGrades.mid === "" ||
      currentGrades.mid === undefined ||
      currentGrades.mid === null ||
      currentGrades.quiz === "" ||
      currentGrades.quiz === undefined ||
      currentGrades.quiz === null ||
      currentGrades.assignment === "" ||
      currentGrades.assignment === undefined ||
      currentGrades.assignment === null ||
      currentGrades.final === "" ||
      currentGrades.final === undefined ||
      currentGrades.final === null
    ) {
      toast.error("All fields are required before submitting");
      return;
    }

    const total = calculateTotal(currentGrades);
    if (total === "Invalid") {
      toast.error("Score exceeds maximum allowed");
      return;
    }

    setSubmitting(prev => ({ ...prev, [student._id]: true }));

    try {
      // Submit the grade with isDraft = false
      const submitData = {
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: currentGrades.mid,
        quiz: currentGrades.quiz,
        assignment: currentGrades.assignment,
        final: currentGrades.final,
        isDraft: false,  // IMPORTANT: This tells backend to lock the grade
        academicYearId: selectedYearId,
      };
      
      console.log("Submitting grade with data:", submitData);
      
      const response = await submitFinalGrade(submitData);
      
      console.log("Submit response:", response);

      // Update local state immediately
      setSubmitted((prev) => ({ ...prev, [student._id]: true }));
      setGrades(prev => ({
        ...prev,
        [student._id]: {
          ...prev[student._id],
          isSubmitted: true,
          isDraft: false,
        }
      }));
      
      toast.success(`✅ Grade submitted for ${student.fullName}`);
      
      // Reload to get updated data from server
      setTimeout(() => {
        loadGrades();
      }, 1000);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(prev => ({ ...prev, [student._id]: false }));
    }
  };

  const handleSaveDraft = async (student) => {
    const currentGrades = grades[student._id];
    
    if (!currentGrades) {
      toast.error("No grades to save");
      return;
    }
    
    // Don't save if already submitted
    if (submitted[student._id]) {
      toast.error("Grade already submitted. Cannot save draft.");
      return;
    }
    
    // Check if at least one field has a value
    const hasAnyValue = 
      (currentGrades.mid && currentGrades.mid !== "") ||
      (currentGrades.quiz && currentGrades.quiz !== "") ||
      (currentGrades.assignment && currentGrades.assignment !== "") ||
      (currentGrades.final && currentGrades.final !== "");
    
    if (!hasAnyValue) {
      return toast.error("No grades to save");
    }

    const total = calculateTotal(currentGrades);
    if (total === "Invalid") {
      toast.error("Score exceeds maximum allowed");
      return;
    }

    setSaving(prev => ({ ...prev, [student._id]: true }));

    try {
      const draftData = {
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: currentGrades.mid || 0,
        quiz: currentGrades.quiz || 0,
        assignment: currentGrades.assignment || 0,
        final: currentGrades.final || 0,
        isDraft: true,  // IMPORTANT: This tells backend to save as draft
        academicYearId: selectedYearId,
      };
      
      console.log("Saving draft with data:", draftData);
      
      const response = await saveGradeDraft(draftData);
      
      console.log("Draft save response:", response);
      
      toast.success(`📝 Draft saved for ${student.fullName}`);
      
      // Reload to ensure draft is persisted
      setTimeout(() => {
        loadGrades();
      }, 500);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Draft save error:", err);
      toast.error(err.response?.data?.message || "Draft save failed");
    } finally {
      setSaving(prev => ({ ...prev, [student._id]: false }));
    }
  };

  // Add this function to check if all Semester 1 grades are submitted
const checkAndUnlockSemester2 = async () => {
  if (selectedSemester === 1) {
    try {
      const response = await checkSemester1Completion(
        selectedClass.classInfo.courseId,
        selectedYearId
      );
      
      const { allCompleted, completedCount, totalStudents } = response.data;
      
      if (allCompleted && totalStudents > 0) {
        toast.success(
          `🎉 All ${totalStudents} students have submitted Semester 1 grades! Semester 2 is now unlocked.`,
          { duration: 5000 }
        );
        
        // Optionally auto-switch to semester 2
        // setSelectedSemester(2);
      }
    } catch (error) {
      console.error("Error checking semester 1 completion:", error);
    }
  }
};

// Call this after each submission
useEffect(() => {
  if (selectedSemester === 1) {
    checkAndUnlockSemester2();
  }
}, [submitted, selectedSemester]);

  const filteredStudents = students.filter((s) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (s.username || "").toLowerCase().includes(term) ||
      (s.fullName || "").toLowerCase().includes(term)
    );
  });

  const semesterStatus = getSemesterStatus();
  const submittedCount = Object.values(submitted).filter(v => v === true).length;
  const draftCount = Object.values(grades).filter(g => g.isDraft === true && !submitted[g.studentId]).length;

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm opacity-70">Loading grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden"
         style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      
      {/* Header with Academic Year */}
      <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Academic Year</h3>
              <select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="mt-1 px-3 py-1.5 rounded-lg text-sm"
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
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{ 
                background: "var(--bg)", 
                border: "1px solid var(--border)" 
              }}
              title="Refresh grades"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>

            <div>
              <label className="text-sm font-medium mr-2">Semester:</label>
              <select
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ 
                  background: "var(--bg)", 
                  color: "var(--text)", 
                  border: "1px solid var(--border)" 
                }}
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Submission Progress</span>
            <span className="text-sm">{submittedCount}/{students.length} Submitted</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(submittedCount / students.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Warning Message */}
        {!semesterStatus.isActive && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
              <AlertCircle size={16} />
              {semesterStatus.message}
            </p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by username or full name..."
            className="w-full px-4 py-2 pl-10 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            style={{ 
              background: "var(--bg)", 
              color: "var(--text)", 
              border: "1px solid var(--border)" 
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">#</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Username</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Full Name</th>

              {/* Semester 2 Extra Columns */}
              {selectedSemester === 2 && (
                <>
                  <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Sem 1 Total</th>
                  <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Sem 2 Total</th>
                  <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Average</th>
                </>
              )}

              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">
                Mid ({weights.midWeight})
              </th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">
                Quiz ({weights.quizWeight})
              </th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">
                Assignment ({weights.assignmentWeight})
              </th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">
                Final ({weights.finalWeight})
              </th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Total</th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Status</th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={selectedSemester === 2 ? 12 : 10} 
                    className="text-center p-8 text-gray-500 dark:text-gray-400">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const g = grades[student._id] || {};
                const total = calculateTotal(g);
                const isSubmitted = submitted[student._id];
                const isSaving = saving[student._id];
                const isSubmitting = submitting[student._id];
                const isDraft = g.isDraft && !isSubmitted;

                return (
                  <tr
                    key={student._id}
                    className={`transition-all duration-200 hover:scale-[1.01] ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    } hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      isSubmitted ? "opacity-75 bg-green-50 dark:bg-green-900/20" : ""
                    }`}
                  >
                    <td className="p-3 border-b dark:border-gray-600 text-center">{idx + 1}</td>
                    <td className="p-3 border-b dark:border-gray-600">{student.username}</td>
                    <td className="p-3 border-b dark:border-gray-600 font-medium">{student.fullName}</td>

                    {/* Semester 2 Extra Data */}
                    {selectedSemester === 2 && (
                      <>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <span className="font-semibold text-blue-600">
                            {semesterExtras[student._id]?.sem1Total || 0}
                          </span>
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <span className="font-semibold text-green-600">
                            {total !== "Invalid" ? total : "—"}
                          </span>
                        </td>
                        <td className="p-3 border-b dark:border-gray-600 text-center">
                          <span className={`font-semibold ${
                            (semesterExtras[student._id]?.average || 0) >= 50 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {semesterExtras[student._id]?.average || "—"}%
                          </span>
                        </td>
                      </>
                    )}

                    {/* Grade Input Fields */}
                    {["mid", "quiz", "assignment", "final"].map((field) => (
                      <td key={field} className="p-2 border-b dark:border-gray-600">
                        <input
                          type="number"
                          step="0.01"
                          value={g[field] || ""}
                          disabled={isSubmitted || !semesterStatus.isActive}
                          className={`w-20 text-center rounded-lg px-2 py-1.5 transition-all duration-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                            isSubmitted ? "bg-gray-100 dark:bg-gray-700" : ""
                          }`}
                          style={{ 
                            background: isSubmitted ? "var(--bg)" : "var(--bg)", 
                            color: "var(--text)", 
                            border: "1px solid var(--border)" 
                          }}
                          onChange={(e) =>
                            handleChange(student._id, field, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    {/* Total */}
                    <td className="p-3 border-b dark:border-gray-600 text-center">
                      <span className={`font-bold text-lg ${
                        total === "Invalid" 
                          ? "text-red-500" 
                          : isSubmitted ? "text-green-600" : "text-blue-600"
                      }`}>
                        {total === "Invalid" ? "Invalid" : total}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="p-3 border-b dark:border-gray-600 text-center">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      ) : isDraft ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 border-b dark:border-gray-600 text-center">
                      {!isSubmitted ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSaveDraft(student)}
                            disabled={isSaving || !semesterStatus.isActive}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-1"
                            style={{ 
                              background: "var(--bg)", 
                              color: "var(--text)", 
                              border: "1px solid var(--border)" 
                            }}
                          >
                            <Save size={14} />
                            {isSaving ? "..." : "Save"}
                          </button>

                          <button
                            onClick={() => handleSubmitFinal(student)}
                            disabled={isSubmitting || !semesterStatus.isActive}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          >
                            <Send size={14} />
                            {isSubmitting ? "..." : "Submit"}
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          <Lock size={12} />
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="opacity-70">
              <strong>{filteredStudents.length}</strong> students shown
            </span>
            <span className="opacity-70">
              <strong>{submittedCount}</strong> submitted
            </span>
            <span className="opacity-70">
              <strong>{draftCount}</strong> drafts
            </span>
          </div>
          <div className="text-xs opacity-50">
            Max scores: Mid({weights.midWeight}) | Quiz({weights.quizWeight}) | Assignment({weights.assignmentWeight}) | Final({weights.finalWeight})
          </div>
        </div>
      </div>
    </div>
  );
}