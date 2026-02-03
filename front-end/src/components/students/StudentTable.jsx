import { Trash2, Pencil } from "lucide-react";

export default function StudentTable({ students, onDelete, onEdit }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="p-3 border dark:border-gray-600 text-left ">Username</th>
          <th className="p-3 border dark:border-gray-600 text-left">Full Name</th>
          <th className="p-3 border dark:border-gray-600 text-left">Grade</th>
          <th className="p-3 border dark:border-gray-600 text-left">Section</th>
          <th className="p-3 border dark:border-gray-600 text-left">Stream</th>
          <th className="p-3 border dark:border-gray-600 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center p-4">
              No students found.
            </td>
          </tr>
        ) : (
          students.map((s, i) => (
            <tr
              key={s._id}
              className={`${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-500"
                  : "bg-gray-100 dark:bg-gray-600"
              } hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <td className="p-3">{s.username}</td>
              <td className="p-3">{s.fullName}</td>
              <td className="p-3">{s.grade}</td>
              <td className="p-3">{s.section}</td>
              <td className="p-3">{s.stream || "-"}</td>

              <td className="p-3 text-center flex justify-center gap-3">
                {/* Edit */}
                <button
                  onClick={() => onEdit && onEdit(s._id)}
                  className="p-2 rounded bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-600"
                >
                  <Pencil size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(s._id)}
                  className="p-2 rounded bg-red-500 dark:bg-red-700 text-white hover:bg-red-600 dark:hover:bg-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
