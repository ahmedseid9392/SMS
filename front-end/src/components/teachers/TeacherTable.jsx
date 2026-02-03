import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherTable({ teachers, onDelete }) {
  const navigate = useNavigate();

  return (
    <table className="min-w-full text-left text-gray-900 dark:text-gray-200">
      <thead className="bg-gray-200 dark:bg-gray-800">
        <tr>
          <th className="p-3">Full Name</th>
          <th className="p-3">Subject</th>
          <th className="p-3">Username</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {teachers.map((t) => (
          <tr
            key={t._id}
            className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td className="p-3">{t.fullName}</td>
            <td className="p-3">{t.subject}</td>
            <td className="p-3">{t.username}</td>

            <td className="p-3 flex gap-3">
              <button
                onClick={() => navigate(`/admin/teachers/edit/${t._id}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(t._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
