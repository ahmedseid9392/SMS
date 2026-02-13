import { useState, useEffect } from "react";
import {
  submitFinalGrade,
  saveGradeDraft,
  getGradesForClass,
  getSemesterTotals,
} from "../../api/gradeService";
import { toast } from "react-hot-toast";

export default function GradeEntryTable({ selectedClass, weights }) {
  const [grades, setGrades] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [semesterExtras, setSemesterExtras] = useState({});
  const [selectedSemester, setSelectedSemester] = useState(1);

  const students = selectedClass.students;

  // ---------------------------------------------------
  // HANDLE INPUT CHANGES
  // ---------------------------------------------------
  const handleChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  // ---------------------------------------------------
  // TOTAL CALCULATION
  // ---------------------------------------------------
  const calculateTotal = (scores) => {
    if (!scores) return 0;

    const MAX = {
      mid: weights.midWeight,
      quiz: weights.quizWeight,
      assignment: weights.assignmentWeight,
      final: weights.finalWeight,
    };

    if (
      scores.mid > MAX.mid ||
      scores.quiz > MAX.quiz ||
      scores.assignment > MAX.assignment ||
      scores.final > MAX.final
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

  // ---------------------------------------------------
  // LOAD SAVED + SUBMITTED GRADES
  // ---------------------------------------------------
  useEffect(() => {
    if (!selectedClass) return;

    const fetchGrades = async () => {
      try {
        const savedGrades = await getGradesForClass(
          selectedClass.classInfo.courseId
        );

        const loaded = {};
        const submittedMap = {};

        // load saved scores
        savedGrades.forEach((g) => {
          const id = g.student._id;

          loaded[id] = {
            mid: g.scores?.mid ?? "",
            quiz: g.scores?.quiz ?? "",
            assignment: g.scores?.assignment ?? "",
            final: g.scores?.final ?? "",
          };

          if (g.locked) {
            submittedMap[id] = true;
          }
        });

        setGrades(loaded);
        setSubmitted(submittedMap);

        // ---- Semester 2 extras ----
        if (selectedSemester === 2) {
          const extra = {};

          for (const st of students) {
            const totals = await getSemesterTotals(
              st._id,
              selectedClass.classInfo.courseId
            );

            extra[st._id] = {
              sem1: totals.sem1 || 0,
              sem2: totals.sem2 || 0,
              average: totals.average || 0,
            };
          }

          setSemesterExtras(extra);
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
        toast.error("Failed to load saved grades");
      }
    };

    fetchGrades();
  }, [selectedClass, selectedSemester]);

  // ---------------------------------------------------
  // SUBMIT FINAL (LOCK)
  // ---------------------------------------------------
  const handleSubmitFinal = async (student) => {
    const scores = grades[student._id];

    if (submitted[student._id]) {
      return toast.error("Already submitted");
    }

    if (
      scores.mid === "" ||
      scores.quiz === "" ||
      scores.assignment === "" ||
      scores.final === ""
    ) {
      return toast.error("All fields are required before submitting");
    }

    if (calculateTotal(scores) === "Invalid") {
      return toast.error("Score exceeds maximum allowed");
    }

    try {
      await submitFinalGrade({
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: scores.mid,
        quiz: scores.quiz,
        assignment: scores.assignment,
        final: scores.final,
        isDraft: false,
      });

      setSubmitted((prev) => ({ ...prev, [student._id]: true }));
      toast.success("Grade submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  // ---------------------------------------------------
  // SAVE DRAFT
  // ---------------------------------------------------
  const handleSaveDraft = async (student) => {
    const scores = grades[student._id];

    if (calculateTotal(scores) === "Invalid") {
      return toast.error("Score exceeds maximum allowed");
    }

    try {
      await saveGradeDraft({
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: selectedSemester,
        mid: scores.mid ?? null,
        quiz: scores.quiz ?? null,
        assignment: scores.assignment ?? null,
        final: scores.final ?? null,
        isDraft: true,
      });

      toast.success("Draft saved");
    } catch (err) {
      toast.error("Draft save failed");
    }
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Students List</h2>

      {/* SEMESTER DROPDOWN WITH STYLE */}
      <select
        className="mb-4 px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(Number(e.target.value))}
      >
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
      </select>

      <div className="overflow-x-auto">
        <table className="w-full border dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">Full Name</th>

              {/* Semester 2 Columns */}
              {selectedSemester === 2 && (
                <>
                  <th className="p-2">Sem 1 Total</th>
                  <th className="p-2">Sem 2 Total</th>
                  <th className="p-2">Average</th>
                </>
              )}

              <th className="p-2">{weights.midWeight}</th>
              <th className="p-2">{weights.quizWeight}</th>
              <th className="p-2">{weights.assignmentWeight}</th>
              <th className="p-2">{weights.finalWeight}</th>
              <th className="p-2">Total</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const g = grades[student._id] || {};
              const total = calculateTotal(g);

              return (
                <tr key={student._id} className="border dark:border-gray-700">
                  <td className="p-2">{student.username}</td>
                  <td className="p-2">{student.fullName}</td>

                  {/* Semester 2 Data */}
                  {selectedSemester === 2 && (
                    <>
                      <td className="p-2">
                        {semesterExtras[student._id]?.sem1 || 0}
                      </td>
                      <td className="p-2">
                        {semesterExtras[student._id]?.sem2 || 0}
                      </td>
                      <td className="p-2">
                        {semesterExtras[student._id]?.average || "-"}
                      </td>
                    </>
                  )}

                  {/* INPUT FIELDS */}
                  {["mid", "quiz", "assignment", "final"].map((field) => (
                    <td className="p-2" key={field}>
                      <input
                        type="number"
                        step="0.01"
                        value={g[field]}
                        disabled={submitted[student._id]}
                        className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                        onChange={(e) =>
                          handleChange(student._id, field, e.target.value)
                        }
                      />
                    </td>
                  ))}

                  <td className="p-2 font-bold">{total}</td>

                  <td className="p-2 flex flex-col gap-2">
                    {!submitted[student._id] ? (
                      <>
                        <button
                          onClick={() => handleSaveDraft(student)}
                          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => handleSubmitFinal(student)}
                          className="px-4 py-2 rounded-md bg-blue-600 text-white"
                        >
                          Submit
                        </button>
                      </>
                    ) : (
                      <span className="text-green-500 font-bold">
                        Submitted
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
