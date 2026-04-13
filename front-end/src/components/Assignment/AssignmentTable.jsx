import { Pencil, Trash2, BookOpen, Users, GraduationCap, Layers } from "lucide-react";

const AssignmentTable = ({ assignments, onDelete, onEdit, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Users size={48} className="opacity-30" />
          <p className="text-gray-500 dark:text-gray-400">No assignments found</p>
          <p className="text-sm opacity-60">Click "Assign Teacher" to create a new assignment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Grade</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Section</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Stream</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Course</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Teacher</th>
            <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((row, index) => {
            const a = row.assignment || row;
            if (!a) return null;

            return (
              <tr
                key={a._id}
                className={`transition-all duration-200 hover:scale-[1.01] ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    <GraduationCap size={12} />
                    Grade {a.grade}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Section {a.section}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  {a.stream ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      <Layers size={12} />
                      {a.stream}
                    </span>
                  ) : (
                    <span className="text-xs opacity-50">—</span>
                  )}
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" />
                    <span className="font-medium">{a.course?.name || "—"}</span>
                  </div>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-green-500" />
                    <span>{a.teacher?.fullName || "—"}</span>
                  </div>
                  {a.teacher?.subject && (
                    <p className="text-xs opacity-60 mt-1">{a.teacher.subject}</p>
                  )}
                </td>

                <td className="p-3 border-b dark:border-gray-600 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(a._id)}
                      className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                      title="Edit Assignment"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(a)}
                      className="p-2 rounded-lg bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                      title="Delete Assignment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTable;