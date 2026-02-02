import React from "react";

const GradeList = ({ students, grades, onChange, onSubmit }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Enter Grades</h2>
      <form onSubmit={onSubmit}>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-center">Score (0-100)</th>
              <th className="px-4 py-2 text-center">Grade (A-F)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grades[student.id]?.score || ""}
                    onChange={(e) => onChange(student.id, "score", e.target.value)}
                    className="w-20 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={grades[student.id]?.grade || ""}
                    onChange={(e) => onChange(student.id, "grade", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>D</option>
                    <option>F</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Grades
        </button>
      </form>
    </div>
  );
};

export default GradeList;