import { useState, useEffect } from "react";
import {
  submitFinalGrade,
  saveGradeDraft,
  getGradesForClass,
  getSemesterTotals,
  getCurrentAcademicYear,
  getAcademicYears,
  checkSemester1Completion,
  getGradingSetting,
} from "../../api/gradeService";
import { toast } from "react-hot-toast";
import { Calendar, AlertCircle, CheckCircle, BookOpen, Users, Save, Send, RefreshCw, Lock } from "lucide-react";

export default function GradeEntryTable({ selectedClass, weights: initialWeights, onSuccess }) {
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
  const [validationErrors, setValidationErrors] = useState({});
  const [weights, setWeights] = useState(initialWeights || {});

  const students = selectedClass?.students || [];

  // Fetch grading settings if not provided
  useEffect(() => {
    const fetchGradingSettings = async () => {
      if (!weights || Object.keys(weights).length === 0) {
        try {
          const response = await getGradingSetting();
          console.log("Fetched grading settings:", response.data);
          const settingData = response.data.setting || response.data;
          setWeights({
            midWeight: settingData.midWeight || 20,
            quizWeight: settingData.quizWeight || 15,
            assignmentWeight: settingData.assignmentWeight || 15,
            finalWeight: settingData.finalWeight || 50,
          });
        } catch (error) {
          console.error("Error fetching grading settings:", error);
          // Set default values if API fails
          setWeights({
            midWeight: 20,
            quizWeight: 15,
            assignmentWeight: 15,
            finalWeight: 50,
          });
        }
      }
    };
    fetchGradingSettings();
  }, []);

  // Get max values from weights
  const maxValues = {
    mid: weights?.midWeight || 20,
    quiz: weights?.quizWeight || 15,
    assignment: weights?.assignmentWeight || 15,
    final: weights?.finalWeight || 50,
  };

  console.log("Max values for validation:", maxValues);
  console.log("Current weights:", weights);

  // Fetch academic years
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await getAcademicYears();
      let years = [];
      if (response.data && Array.isArray(response.data)) {
        years = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        years = response.data.data;
      } else if (Array.isArray(response)) {
        years = response;
      }
      
      setAcademicYears(years);
      
      const currentYearRes = await getCurrentAcademicYear();
      const currentYear = currentYearRes.data || currentYearRes;
      setAcademicYear(currentYear);
      setSelectedYearId(currentYear?._id || (years[0]?._id || ""));
    } catch (error) {
      console.error("Error fetching academic years:", error);
      setAcademicYears([]);
      setSelectedYearId("default");
    }
  };

  const loadGrades = async () => {
    if (!selectedClass || !selectedClass.classInfo?.courseId) {
      setLoading(false);
      return;
    }

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
      }
      
      const loaded = {};
      const submittedMap = {};
      
      students.forEach(student => {
        loaded[student._id] = {
          mid: "",
          quiz: "",
          assignment: "",
          final: "",
          total: 0,
          isSubmitted: false,
          isDraft: false,
        };
        submittedMap[student._id] = false;
      });
      
      for (const gradeRecord of savedGrades) {
        const studentId = gradeRecord.student?._id || gradeRecord.student;
        const semKey = selectedSemester === 1 ? "sem1" : "sem2";
        
        if (gradeRecord[semKey] && gradeRecord[semKey].locked === true) {
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
        } 
        else if (gradeRecord.draft && gradeRecord.draft.semester === selectedSemester) {
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
        }
      }
      
      setGrades(loaded);
      setSubmitted(submittedMap);
      
    } catch (err) {
      console.error("LOAD ERROR:", err);
      toast.error("Failed to load saved grades");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedYearId) {
      loadGrades();
    }
  }, [selectedClass, selectedSemester, selectedYearId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadGrades();
    toast.success("Refreshing grades...");
  };

  // Validate a single score against max value
  const validateScore = (field, value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return true;
    if (numValue < 0) return false;
    if (numValue > maxValues[field]) return false;
    return true;
  };

  // Get validation error message
  const getValidationError = (field, value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return `Please enter a valid number`;
    if (numValue < 0) return `${field} cannot be negative`;
    if (numValue > maxValues[field]) return `${field} cannot exceed ${maxValues[field]}`;
    return null;
  };

  const calculateTotal = (scores) => {
    if (!scores) return 0;
    
    const mid = Number(scores.mid) || 0;
    const quiz = Number(scores.quiz) || 0;
    const assignment = Number(scores.assignment) || 0;
    const final = Number(scores.final) || 0;
    
    // Validate before calculating total
    if (mid > maxValues.mid || quiz > maxValues.quiz || 
        assignment > maxValues.assignment || final > maxValues.final) {
      return "Invalid";
    }
    
    const total = mid + quiz + assignment + final;
    return Number(total.toFixed(2));
  };

  const handleChange = (studentId, field, value) => {
    if (submitted[studentId]) {
      toast.error("Grade already submitted. Cannot modify.");
      return;
    }
    
    // Validate the input
    const numValue = value === "" ? "" : Number(value);
    const isValid = validateScore(field, numValue);
    
    // Update validation error state
    setValidationErrors(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: isValid ? null : getValidationError(field, numValue)
      }
    }));
    
    // Only update if value is within bounds or empty
    if (value === "" || (numValue >= 0 && numValue <= maxValues[field])) {
      setGrades((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value === "" ? "" : numValue,
        },
      }));
    } else {
      toast.error(`${field} cannot exceed ${maxValues[field]}`);
    }
  };

  const validateAllScores = (scores) => {
    const errors = [];
    
    if (scores.mid === "" || scores.mid === undefined || scores.mid === null) {
      errors.push("Mid score is required");
    } else if (scores.mid > maxValues.mid) {
      errors.push(`Mid score cannot exceed ${maxValues.mid}`);
    }
    
    if (scores.quiz === "" || scores.quiz === undefined || scores.quiz === null) {
      errors.push("Quiz score is required");
    } else if (scores.quiz > maxValues.quiz) {
      errors.push(`Quiz score cannot exceed ${maxValues.quiz}`);
    }
    
    if (scores.assignment === "" || scores.assignment === undefined || scores.assignment === null) {
      errors.push("Assignment score is required");
    } else if (scores.assignment > maxValues.assignment) {
      errors.push(`Assignment score cannot exceed ${maxValues.assignment}`);
    }
    
    if (scores.final === "" || scores.final === undefined || scores.final === null) {
      errors.push("Final score is required");
    } else if (scores.final > maxValues.final) {
      errors.push(`Final score cannot exceed ${maxValues.final}`);
    }
    
    return errors;
  };

  const handleSaveDraft = async (student) => {
    const currentGrades = grades[student._id];
    
    if (!currentGrades) {
      toast.error("No grades to save");
      return;
    }
    
    if (submitted[student._id]) {
      toast.error("Grade already submitted. Cannot save draft.");
      return;
    }
    
    const hasAnyValue = 
      (currentGrades.mid && currentGrades.mid !== "") ||
      (currentGrades.quiz && currentGrades.quiz !== "") ||
      (currentGrades.assignment && currentGrades.assignment !== "") ||
      (currentGrades.final && currentGrades.final !== "");
    
    if (!hasAnyValue) {
      return toast.error("No grades to save");
    }
    
    // Validate scores before saving draft
    const validationErrorsList = validateAllScores(currentGrades);
    if (validationErrorsList.length > 0) {
      validationErrorsList.forEach(error => toast.error(error));
      return;
    }
    
    setSaving(prev => ({ ...prev, [student._id]: true }));
    
    try {
      await saveGradeDraft({
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: currentGrades.mid || 0,
        quiz: currentGrades.quiz || 0,
        assignment: currentGrades.assignment || 0,
        final: currentGrades.final || 0,
        isDraft: true,
        academicYearId: selectedYearId,
      });
      
      toast.success(`Draft saved for ${student.fullName}`);
      setGrades(prev => ({
        ...prev,
        [student._id]: { ...prev[student._id], isDraft: true }
      }));
      
      setTimeout(() => loadGrades(), 500);
      
    } catch (err) {
      console.error("Draft save error:", err);
      toast.error("Draft save failed");
    } finally {
      setSaving(prev => ({ ...prev, [student._id]: false }));
    }
  };
  
  const handleSubmitFinal = async (student) => {
    const currentGrades = grades[student._id];
    
    if (!currentGrades) {
      toast.error("No grades found for this student");
      return;
    }
    
    if (submitted[student._id]) {
      toast.error("Already submitted");
      return;
    }
    
    // Validate all scores before submission
    const validationErrorsList = validateAllScores(currentGrades);
    if (validationErrorsList.length > 0) {
      validationErrorsList.forEach(error => toast.error(error));
      return;
    }
    
    // Double check max values
    if (currentGrades.mid > maxValues.mid) {
      toast.error(`Mid score cannot exceed ${maxValues.mid}`);
      return;
    }
    if (currentGrades.quiz > maxValues.quiz) {
      toast.error(`Quiz score cannot exceed ${maxValues.quiz}`);
      return;
    }
    if (currentGrades.assignment > maxValues.assignment) {
      toast.error(`Assignment score cannot exceed ${maxValues.assignment}`);
      return;
    }
    if (currentGrades.final > maxValues.final) {
      toast.error(`Final score cannot exceed ${maxValues.final}`);
      return;
    }
    
    setSubmitting(prev => ({ ...prev, [student._id]: true }));
    
    try {
      await submitFinalGrade({
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: currentGrades.mid,
        quiz: currentGrades.quiz,
        assignment: currentGrades.assignment,
        final: currentGrades.final,
        isDraft: false,
        academicYearId: selectedYearId,
      });
      
      setSubmitted((prev) => ({ ...prev, [student._id]: true }));
      toast.success(`Grade submitted for ${student.fullName}`);
      
      setTimeout(() => loadGrades(), 1000);
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(prev => ({ ...prev, [student._id]: false }));
    }
  };
  
  const filteredStudents = students.filter((s) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (s.username || "").toLowerCase().includes(term) ||
      (s.fullName || "").toLowerCase().includes(term)
    );
  });
  
  const submittedCount = Object.values(submitted).filter(v => v === true).length;
  const draftCount = Object.values(grades).filter(g => g.isDraft === true).length;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm opacity-70">Loading grades...</p>
        </div>
      </div>
    );
  }
  
  if (!selectedClass) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No class selected</p>
      </div>
    );
  }
  
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No students found in this class</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl shadow-lg overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Grade Entry</h3>
              <p className="text-sm opacity-70">{selectedClass.classInfo?.course}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            </button>
            
            <div>
              <label className="text-sm font-medium mr-2">Semester:</label>
              <select
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Max Score Info - Shows current grading weights */}
        <div className="mt-4 text-xs text-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <span className="font-semibold">Grading Weights:</span> Mid({maxValues.mid}) | Quiz({maxValues.quiz}) | Assignment({maxValues.assignment}) | Final({maxValues.final}) | Total({maxValues.mid + maxValues.quiz + maxValues.assignment + maxValues.final})
        </div>
        
        {/* Progress Bar */}
        {students.length > 0 && (
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
        )}
      </div>
      
      {/* Search Bar */}
      <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by username or full name..."
            className="w-full px-4 py-2 pl-10 rounded-xl"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
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
              <th className="p-3 border text-left">#</th>
              <th className="p-3 border text-left">Username</th>
              <th className="p-3 border text-left">Full Name</th>
              <th className="p-3 border text-center">Mid (Max: {maxValues.mid})</th>
              <th className="p-3 border text-center">Quiz (Max: {maxValues.quiz})</th>
              <th className="p-3 border text-center">Assignment (Max: {maxValues.assignment})</th>
              <th className="p-3 border text-center">Final (Max: {maxValues.final})</th>
              <th className="p-3 border text-center">Total</th>
              <th className="p-3 border text-center">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => {
              const g = grades[student._id] || {};
              const total = calculateTotal(g);
              const isSubmitted = submitted[student._id];
              const isDraft = g.isDraft && !isSubmitted;
              const hasError = validationErrors[student._id];
              
              return (
                <tr key={student._id} className={`border-b ${isSubmitted ? "bg-green-50 dark:bg-green-900/20" : ""}`}>
                  <td className="p-3 text-center">{idx + 1}</td>
                  <td className="p-3">{student.username}</td>
                  <td className="p-3 font-medium">{student.fullName}</td>
                  
                  {["mid", "quiz", "assignment", "final"].map((field) => (
                    <td key={field} className="p-2">
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={maxValues[field]}
                          value={g[field] || ""}
                          disabled={isSubmitted}
                          className={`w-20 text-center rounded-lg px-2 py-1.5 disabled:opacity-50 ${
                            hasError?.[field] ? "border-red-500 ring-1 ring-red-500" : ""
                          }`}
                          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                          onChange={(e) => handleChange(student._id, field, e.target.value)}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value !== "" && (Number(value) < 0 || Number(value) > maxValues[field])) {
                              toast.error(`${field} must be between 0 and ${maxValues[field]}`);
                            }
                          }}
                        />
                        {hasError?.[field] && (
                          <p className="text-red-500 text-xs mt-1">{hasError[field]}</p>
                        )}
                      </div>
                    </td>
                  ))}
                  
                  <td className="p-3 text-center font-bold">
                    <span className={total === "Invalid" ? "text-red-500" : "text-blue-600"}>
                      {total}
                    </span>
                  </td>
                  
                  <td className="p-3 text-center">
                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Completed
                      </span>
                    ) : isDraft ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    )}
                  </td>
                  
                  <td className="p-3 text-center">
                    {!isSubmitted ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveDraft(student)}
                          disabled={saving[student._id]}
                          className="px-3 py-1.5 rounded-lg text-sm bg-green-00 hover:bg-green-300 disabled:opacity-50"
                        >
                          <Save size={14} className="inline mr-1" />
                          {saving[student._id] ? "..." : "Save"}
                        </button>
                        <button
                          onClick={() => handleSubmitFinal(student)}
                          disabled={submitting[student._id]}
                          className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send size={14} className="inline mr-1" />
                          {submitting[student._id] ? "..." : "Submit"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center gap-1 justify-center">
                        <Lock size={14} /> Locked
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t" style={{ background: "var(--bg)" }}>
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span><strong>{filteredStudents.length}</strong> students</span>
            <span><strong>{submittedCount}</strong> submitted</span>
            <span><strong>{draftCount}</strong> drafts</span>
          </div>
          <div className="text-xs opacity-60">
            Total possible: {maxValues.mid + maxValues.quiz + maxValues.assignment + maxValues.final}
          </div>
        </div>
      </div>
    </div>
  );
}