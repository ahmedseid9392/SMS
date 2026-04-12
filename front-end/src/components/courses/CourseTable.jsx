import { Pencil, Trash2, BookOpen, GraduationCap, Layers } from "lucide-react";

export default function CourseTable({ courses = [], onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Course Name</th>
          <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Grade Level</th>
          <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Stream</th>
          <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {courses.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center p-8">
              <div className="flex flex-col items-center gap-2">
                <BookOpen size={48} className="opacity-30" />
                <p className="text-gray-500 dark:text-gray-400">No courses found</p>
              </div>
            </td>
          </tr>
        ) : (
          courses.map((course, index) => (
            <tr
              key={course._id}
              className={`transition-all duration-200 hover:scale-[1.01] ${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-700"
              } hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              <td className="p-3 border-b dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-500" />
                  <span className="font-medium">{course.name}</span>
                </div>
              </td>
              
              <td className="p-3 border-b dark:border-gray-600">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  <GraduationCap size={12} />
                  Grade {course.gradeLevel}
                </span>
              </td>
              
              <td className="p-3 border-b dark:border-gray-600">
                {course.stream ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    <Layers size={12} />
                    {course.stream}
                  </span>
                ) : (
                  <span className="text-xs opacity-50">—</span>
                )}
              </td>

              <td className="p-3 border-b dark:border-gray-600 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(course)}
                    className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                    title="Edit Course"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(course)}
                    className="p-2 rounded-lg bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                    title="Delete Course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}