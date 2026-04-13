import { Users, Mail, Phone, Award, CheckCircle, XCircle, User, GraduationCap } from "lucide-react";

const AssignedStudentsTable = ({ students }) => {
  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status !== "Inactive").length;
  const maleStudents = students.filter(s => s.sex === "Male" || s.gender === "Male").length;
  const femaleStudents = students.filter(s => s.sex === "Female" || s.gender === "Female").length;

  if (students.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center"
           style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
            <Users size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold">No Students Found</h3>
          <p className="text-sm opacity-70">No students are assigned to this class yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-105"
             style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <Users size={18} className="mx-auto mb-1 text-blue-500" />
          <p className="text-2xl font-bold">{totalStudents}</p>
          <p className="text-xs opacity-70">Total</p>
        </div>
        
        <div className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-105"
             style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <Award size={18} className="mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold">{activeStudents}</p>
          <p className="text-xs opacity-70">Active</p>
        </div>
        
        <div className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-105"
             style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <User size={18} className="mx-auto mb-1 text-blue-600" />
          <p className="text-2xl font-bold">{maleStudents}</p>
          <p className="text-xs opacity-70">Male</p>
        </div>
        
        <div className="rounded-xl p-3 text-center transition-all duration-300 hover:scale-105"
             style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <User size={18} className="mx-auto mb-1 text-pink-500" />
          <p className="text-2xl font-bold">{femaleStudents}</p>
          <p className="text-xs opacity-70">Female</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">#</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Student ID</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Full Name</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Gender</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Contact</th>
              <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Grade</th>
              <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                className={`transition-all duration-200 hover:scale-[1.01] ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="p-3 border-b dark:border-gray-600 text-center">
                  <span className="font-semibold text-sm">{index + 1}</span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-blue-500" />
                    <span className="font-mono text-sm">{student.username || student.studentId || "—"}</span>
                  </div>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <div>
                    <p className="font-semibold">{student.fullName}</p>
                    {student.email && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail size={10} className="opacity-50" />
                        <span className="text-xs opacity-60">{student.email}</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    student.sex === "Male" || student.gender === "Male"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
                  }`}>
                    <User size={12} />
                    {student.sex || student.gender || "—"}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  {student.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone size={12} className="opacity-50" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                  ) : (
                    <span className="text-xs opacity-50">—</span>
                  )}
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    Grade {student.grade || student.gradeLevel || "N/A"}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    student.status === "Active" || !student.status
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}>
                    {student.status === "Active" || !student.status ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {student.status || "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Note */}
      <div className="text-center text-xs opacity-50 pt-2">
        Showing {students.length} student{students.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default AssignedStudentsTable;