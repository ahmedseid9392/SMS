import { useState, useEffect } from "react";
import { submitFinalGrade, saveGradeDraft } from "../../api/gradeService";
import { toast } from "react-hot-toast";

export default function GradeEntryTable({ selectedClass, weights }) {
  const [grades, setGrades] = useState({});
  const [submitted, setSubmitted] = useState({});
  const students = selectedClass.students;

  // -------------------------
  // HANDLE INPUT CHANGE
  // -------------------------
  const handleChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value === "" ? "" : Number(value),
      },
    }));
  };

  // -------------------------
  // TOTAL CALCULATION (RAW)
  // -------------------------
  const calculateTotal = (scores) => {
  if (!scores) return 0;

  const MAX = {
    mid: weights.midWeight,
    quiz: weights.quizWeight,
    assignment: weights.assignmentWeight,
    final: weights.finalWeight,
  };

  // validation
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


  // -------------------------
  // LOAD SAVED OR SUBMITTED
  // -------------------------
  useEffect(() => {
    if (!selectedClass) return;

    const loaded = {};
    const submittedStatus = {};

    selectedClass.students.forEach((st) => {
      if (st.scores) {
        loaded[st._id] = {
          mid: st.scores.mid ?? "",
          quiz: st.scores.quiz ?? "",
          assignment: st.scores.assignment ?? "",
          final: st.scores.final ?? "",
        };

        // IF NOT DRAFT → SUBMITTED
        if (st.scores.isDraft === false) {
          submittedStatus[st._id] = true;
        }
      }
    });

    setGrades(loaded);
    setSubmitted(submittedStatus);
  }, [selectedClass]);

  // -------------------------
  // SUBMIT FINAL
  // -------------------------
  const handleSubmitFinal = async (student) => {
    const scores = grades[student._id];

    if (submitted[student._id]) {
      return toast.error("Already submitted");
    }

    // Required fields check
    if (
      scores.mid === "" ||
      scores.quiz === "" ||
      scores.assignment === "" ||
      scores.final === ""
    ) {
      return toast.error("All fields are required before submitting");
    }

    // Max score validation
    if (calculateTotal(scores) === "Invalid") {
      return toast.error("Score exceeds maximum allowed");
    }

    try {
      const payload = {
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: 1,
        mid: Number(scores.mid),
        quiz: Number(scores.quiz),
        assignment: Number(scores.assignment),
        final: Number(scores.final),
        isDraft: false,
      };

      await submitFinalGrade(payload);

      setSubmitted((prev) => ({ ...prev, [student._id]: true }));

      toast.success("Final grade submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  // -------------------------
  // SAVE DRAFT (UPSERT)
  // -------------------------
  const handleSaveDraft = async (student) => {
    const scores = grades[student._id];

    // Save empty allowed? YES (as draft)
    if (calculateTotal(scores) === "Invalid") {
      return toast.error("Score exceeds maximum allowed");
    }

    try {
      const payload = {
        studentId: student._id,
        courseId: selectedClass.classInfo.courseId,
        semester: 1,
        mid: scores.mid ?? null,
        quiz: scores.quiz ?? null,
        assignment: scores.assignment ?? null,
        final: scores.final ?? null,
        status: null, // REQUIRED BY YOU
        locked: false, // REQUIRED BY YOU
        isDraft: true,
      };

      await saveGradeDraft(payload);

      toast.success("Draft saved");
    } catch (err) {
      toast.error("Draft save failed");
    }
  };

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Students List</h2>

      <div className="overflow-x-auto">
        <table className="w-full border dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">Full Name</th>
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

                  {/* MID */}
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={g.mid}
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) =>
                        handleChange(student._id, "mid", e.target.value)
                      }
                    />
                  </td>

                  {/* QUIZ */}
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={g.quiz}
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) =>
                        handleChange(student._id, "quiz", e.target.value)
                      }
                    />
                  </td>

                  {/* ASSIGNMENT */}
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={g.assignment}
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) =>
                        handleChange(student._id, "assignment", e.target.value)
                      }
                    />
                  </td>

                  {/* FINAL */}
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={g.final}
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) =>
                        handleChange(student._id, "final", e.target.value)
                      }
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="p-2 font-bold">{total}</td>

                  {/* ACTION BUTTONS */}
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
