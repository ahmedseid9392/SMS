import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTeachers } from "../../api/teacherService";
import { getCourses } from "../../api/courseService";
import {
  createAssignment,
  updateAssignment,
  getAssignmentById,
} from "../../api/TeacherAssignmentService";

import { useAuth } from "../../context/AuthContext";

const AssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const token = user?.token;

  const isEdit = Boolean(id);

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    grade: "",
    section: "",
    stream: "",
    course: "",
    teacher: "",
  });

  // ----------------------------
  // HANDLE INPUT CHANGES
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------
  // LOAD TEACHERS + COURSES
  // ----------------------------
  const loadData = async () => {
    try {
      const t = await getTeachers(token);
      const c = await getCourses(token);

      const teacherList =
        t?.teachers ||
        t?.data?.teachers ||
        t?.data ||
        (Array.isArray(t) ? t : []);

      const courseList =
        c?.courses ||
        c?.data ||
        (Array.isArray(c) ? c : []);

      setTeachers(teacherList);
      setCourses(courseList);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setMsg("Failed to load teachers or courses");
    }
  };

  // ----------------------------
  // LOAD EDIT DATA
  // ----------------------------
  const loadAssignment = async () => {
    try {
      const res = await getAssignmentById(id);

      const a =
        res?.assignment ||
        res?.data?.assignment ||
        res?.data ||
        res;

      if (!a) {
        console.error("Invalid assignment response:", res);
        return;
      }

      setForm({
        grade: a.grade || "",
        section: a.section || "",
        stream: a.stream || "",
        course: a.course?._id || "",
        teacher: a.teacher?._id || "",
      });
    } catch (err) {
      console.error("LOAD EDIT ERROR:", err);
    }
  };

  // ----------------------------
  // INITIAL LOAD
  // ----------------------------
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit && teachers.length > 0 && courses.length > 0) {
      loadAssignment();
    }
  }, [isEdit, teachers, courses]);

  // ----------------------------
  // VALIDATION
  // ----------------------------
  const validate = () => {
    if (!form.grade || !form.section || !form.course || !form.teacher) {
      setMsg("All required fields must be filled.");
      return false;
    }
    return true;
  };

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEdit) {
        await updateAssignment(id, form, token);
      } else {
        await createAssignment(form, token);
      }

      navigate("/admin/assignment");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      setMsg("Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {isEdit ? "Edit Assignment" : "Assign Teacher to Course"}
      </h2>

      {msg && <p className="mb-3 text-red-500 font-medium">{msg}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Grade */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Grade</label>
          <input
            name="grade"
            type="number"
            min="9"
            max="12"
            value={form.grade}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        </div>

        {/* Section */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Section</label>
          <input
            name="section"
            value={form.section}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          />
        </div>

        {/* Stream */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Stream</label>
          <select
            name="stream"
            value={form.stream}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <option value="">Select Stream</option>
            <option value="Natural">Natural</option>
            <option value="Social">Social</option>
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Course</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <option value="">Select Course</option>

            {courses
              .filter((c) => {
                if (!form.grade) return true;
                if (c.gradeLevel != form.grade) return false;

                if (!form.stream) return true;
                return c.stream === form.stream || c.stream === "None";
              })
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} (Grade {c.gradeLevel}, {c.stream})
                </option>
              ))}
          </select>
        </div>

        {/* Teacher */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Teacher</label>
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <option value="">Select Teacher</option>

            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullName} : {t.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/assignment")}
            className="px-5 py-2 rounded-lg bg-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            {loading ? "Saving..." : isEdit ? "Update Assignment" : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
