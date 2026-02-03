import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "../../api/courseService";
import { getTeachers } from "../../api/teacherService";
import toast from "react-hot-toast";

export default function CourseFormModal({ onClose, course, token, onSaved }) {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    gradeLevel: "",
    stream: "",
    teacher: "",
  });

  useEffect(() => {
    if (course) setForm(course);
    loadTeachers();
  }, [course]);

  const loadTeachers = async () => {
    const res = await getTeachers(token);
    setTeachers(res.data || []);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.gradeLevel || !form.teacher) {
      toast.error("Please fill all required fields");
      return;
    }

    if ((form.gradeLevel == 11 || form.gradeLevel == 12) && !form.stream) {
      toast.error("Stream is required for grade 11 & 12");
      return;
    }

    try {
      if (course) {
        await updateCourse(course._id, form, token);
      } else {
        await createCourse(form, token);
      }
      toast.success("Course saved!");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save course");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-md w-[400px]">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {course ? "Edit Course" : "Add Course"}
        </h2>

        <input
          className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
          placeholder="Grade Level"
          type="number"
          value={form.gradeLevel}
          onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
        />

        {(form.gradeLevel == 11 || form.gradeLevel == 12) && (
          <select
            className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
            value={form.stream}
            onChange={(e) => setForm({ ...form, stream: e.target.value })}
          >
            <option value="">Select Stream</option>
            <option value="Natural">Natural</option>
            <option value="Social">Social</option>
          </select>
        )}

        <select
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={form.teacher}
          onChange={(e) => setForm({ ...form, teacher: e.target.value })}
        >
          <option value="">Assign Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
