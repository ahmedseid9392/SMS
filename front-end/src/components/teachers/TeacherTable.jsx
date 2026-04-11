import { Pencil, Trash, Eye, Mail, Phone, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

export default function TeacherTable({ teachers, onDelete, onEdit, onView }) {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeacher && onDelete) {
      onDelete(selectedTeacher);
      setDeleteModalOpen(false);
      setSelectedTeacher(null);
    }
  };

  const handleEdit = (teacherId) => {
    if (onEdit) {
      onEdit(teacherId);
    } else {
      navigate(`/admin/teachers/edit/${teacherId}`);
    }
  };

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Teacher</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Subject</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Qualification</th>
            <th className="p-3 border dark:border-gray-600 text-left text-sm font-semibold">Contact</th>
            <th className="p-3 border dark:border-gray-600 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl">👨‍🏫</div>
                  <p className="text-gray-500 dark:text-gray-400">No teachers found</p>
                </div>
              </td>
            </tr>
          ) : (
            teachers.map((teacher, i) => (
              <tr
                key={teacher._id}
                className={`transition-all duration-200 hover:scale-[1.01] ${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600`}
              >
                <td className="p-3 border-b dark:border-gray-600">
                  <div>
                    <p className="font-semibold">{teacher.fullName}</p>
                    <p className="text-xs opacity-60">@{teacher.username}</p>
                  </div>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    <BookOpen size={12} />
                    {teacher.subjects?.[0] || teacher.subject}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    {teacher.qualification || "N/A"}
                  </span>
                </td>
                
                <td className="p-3 border-b dark:border-gray-600">
                  <div className="space-y-1">
                    {teacher.email && (
                      <div className="flex items-center gap-1 text-xs">
                        <Mail size={12} className="opacity-50" />
                        <span>{teacher.email}</span>
                      </div>
                    )}
                    {teacher.phone && (
                      <div className="flex items-center gap-1 text-xs">
                        <Phone size={12} className="opacity-50" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-3 border-b dark:border-gray-600 text-center">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(teacher._id)}
                        className="p-2 rounded-lg bg-teal-500 dark:bg-teal-600 text-white hover:bg-teal-600 transition-all duration-200 hover:scale-110"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(teacher._id)}
                      className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                      title="Edit Teacher"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(teacher)}
                      className="p-2 rounded-lg bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                      title="Delete Teacher"
                    >
                      <Trash size={16} />
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
          setSelectedTeacher(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.fullName}?`}
        subtitle="This action cannot be undone. All teacher data including assigned classes and courses will be permanently removed."
        type="delete"
      />
    </>
  );
}