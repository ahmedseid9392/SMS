import { Trash2, Pencil, Eye } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function StudentTable({ students, onDelete, onEdit, onView }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      onDelete(selectedStudent._id);
      setDeleteModalOpen(false);
      setSelectedStudent(null);
    }
  };

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Username</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Full Name</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Grade</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Section</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Stream</th>
            <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl">👨‍🎓</div>
                  <p className="text-gray-500 dark:text-gray-400">No students found</p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((s, i) => (
              <tr
                key={s._id}
                className={`transition-all duration-200 hover:scale-[1.01] ${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="p-3 border-b dark:border-gray-600">{s.username}</td>
                <td className="p-3 border-b dark:border-gray-600 font-medium">{s.fullName}</td>
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Grade {s.grade}
                  </span>
                </td>
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    Section {s.section}
                  </span>
                </td>
                <td className="p-3 border-b dark:border-gray-600">
                  {s.stream ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {s.stream}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 border-b dark:border-gray-600 text-center">
                  <div className="flex justify-center gap-2">
                    {/* View Button */}
                    {onView && (
                      <button
                        onClick={() => onView(s._id)}
                        className="p-2 rounded-lg bg-teal-500 dark:bg-teal-600 text-white hover:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-200 hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    )}

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit && onEdit(s._id)}
                      className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 hover:scale-110"
                      title="Edit Student"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(s)}
                      className="p-2 rounded-lg bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 hover:scale-110"
                      title="Delete Student"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedStudent(null);
        }}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.fullName}?`}
        subtitle="This action cannot be undone. All student data including grades, attendance, and assignments will be permanently removed."
        onConfirm={handleConfirmDelete}
        type="delete"
      />
    </>
  );
}