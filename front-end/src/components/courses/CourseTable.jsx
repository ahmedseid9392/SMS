import { Pencil, Trash2 } from "lucide-react";

export default function CourseTable({ courses = [], onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
        <tr>
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Grade</th>
          <th className="p-3 border">Stream</th>
        
          <th className="p-3 border">Actions</th>
        </tr>
      </thead>

      <tbody className="dark:bg-gray-900 dark:text-gray-100">
        {courses.map((course) => (
          <tr key={course._id} className="border dark:border-gray-700">
            <td className="p-3 border">{course.name}</td>
            <td className="p-3 border">{course.gradeLevel}</td>
            <td className="p-3 border">{course.stream || "—"}</td>
         

            <td className="p-3 border flex gap-2">
              <button
                onClick={() => onEdit(course)}
                className="text-blue-600 dark:text-blue-400"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(course._id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
