import { useState } from "react";
import { submitGrade } from "../../api/gradeService";

export default function GradeEntryTable({ selectedClass, weights }) {
  const [grades, setGrades] = useState({});
  const [submitted, setSubmitted] = useState({});
  const students = selectedClass.students;

  const handleChange = (studentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Number(value),
      },
    }));
  };

  const calculateTotal = (g) => {
    if (!g) return 0;
    return (
      (g.mid || 0) * weights.midWeight +
      (g.quiz || 0) * weights.quizWeight +
      (g.assignment || 0) * weights.assignmentWeight +
      (g.final || 0) * weights.finalWeight
    ).toFixed(2);
  };

  const handleSubmit = async (student) => {
    const g = grades[student._id];
    if (!g) return alert("Fill all fields");

    const payload = {
      studentId: student._id,
      classInfo: selectedClass.classInfo,
      scores: g,
    };

    const res = await submitGrade(payload);

    if (res.data.success || res.data.message === "Grade submitted") {
      setSubmitted((prev) => ({ ...prev, [student._id]: true }));
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
              <th className="p-2">Mid (15%)</th>
              <th className="p-2">Quiz (10%)</th>
              <th className="p-2">Assignment (25%)</th>
              <th className="p-2">Final (50%)</th>
              <th className="p-2">Total</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const g = grades[student._id];
              const total = calculateTotal(g);

              return (
                <tr key={student._id} className="border dark:border-gray-700">
                  <td className="p-2">{student.username}</td>
                  <td className="p-2">{student.fullName}</td>

                  {/* MID */}
                  <td className="p-2">
                    <input
                      type="number"
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) => handleChange(student._id, "mid", e.target.value)}
                    />
                  </td>

                  {/* QUIZ */}
                  <td className="p-2">
                    <input
                      type="number"
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) => handleChange(student._id, "quiz", e.target.value)}
                    />
                  </td>

                  {/* ASSIGNMENT */}
                  <td className="p-2">
                    <input
                      type="number"
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
                      disabled={submitted[student._id]}
                      className="w-full rounded bg-gray-100 dark:bg-gray-800 p-1"
                      onChange={(e) => handleChange(student._id, "final", e.target.value)}
                    />
                  </td>

                  {/* TOTAL */}
                  <td className="p-2 font-bold">{total}</td>

                  {/* ACTION */}
                  <td className="p-2">
                    {!submitted[student._id] ? (
                      <button
                        onClick={() => handleSubmit(student)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Submit
                      </button>
                    ) : (
                      <span className="text-green-500 font-bold">Submitted</span>
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
