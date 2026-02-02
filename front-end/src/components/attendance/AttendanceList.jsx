import React from "react";

const AttendanceList = ({ students, attendance, onChange, onSubmit }) => {
  const statusOptions = [
    { value: "present", label: "Present", color: "text-green-600" },
    { value: "absent", label: "Absent", color: "text-red-600" },
    { value: "permission", label: "Permission", color: "text-amber-600" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
      <form onSubmit={onSubmit}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">No.</th>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={attendance[student.id] || "present"}
                      onChange={(e) => onChange(student.id, e.target.value)}
                      className="border rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-medium"
          >
            Submit Attendance
          </button>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-8 text-sm">
          {statusOptions.map(option => (
            <div key={option.value} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full bg-${option.value === "present" ? "green" : option.value === "absent" ? "red" : "amber"}-500`}></div>
              <span className={option.color}>{option.label}</span>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default AttendanceList;