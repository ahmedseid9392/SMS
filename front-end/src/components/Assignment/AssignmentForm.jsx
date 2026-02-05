import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { getTeachers } from "../../api/teacherService";
import { getCourses } from "../../api/courseService";
import { createAssignment ,getAssignmentById,updateAssignment} from "../../api/TeacherAssignmentService";
import { useAuth } from "../../context/AuthContext";

const AssignmentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
   const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    grade: "",
    section: "",
    stream: "",
    course: "",
    teacher: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // When grade or stream changes → re-filter courses
    if (name === "grade" || name === "stream") {
      filterCourses(
        name === "grade" ? value : form.grade,
        name === "stream" ? value : form.stream
      );
    }
  };

  /** Load teachers + courses from API */
  const loadData = async () => {
  try {
    const t = await getTeachers(token);
    const c = await getCourses(token);

   
    // Teachers come inside t.data.teachers
    const teacherList = Array.isArray(t?.data?.teachers)
      ? t.data.teachers
      : [];

    // Courses come directly as array
    const courseList = Array.isArray(c?.data)
      ? c.data
      : Array.isArray(c)
      ? c
      : [];

    setTeachers(teacherList);
    setCourses(courseList);
  } catch (err) {
    console.error("Error loading:", err);
    setMsg("Failed to load teachers or courses.");
  }
};

const isEdit = Boolean(id);

useEffect(() => {
  if (!isEdit) return; // create mode

  const load = async () => {
    const res = await getAssignmentById(id);

    setForm({
      grade: res.assignment.grade,
      section: res.assignment.section,
      stream: res.assignment.stream,
      course: res.assignment.course._id,
      teacher: res.assignment.teacher._id,
    });
  };

  load();
}, [id]);


  /** Filter courses based on grade + stream */
  const filterCourses = (grade, stream) => {
    if (!grade || !stream) {
      setFilteredCourses([]);
      return;
    }

    const result = courses.filter(
      (c) =>
        Number(c.grade) === Number(grade) &&
        c.stream?.toLowerCase() === stream.toLowerCase()
    );

    setFilteredCourses(result);
  };

  /** Validation */
  const validate = () => {
    if (!form.grade || !form.section || !form.course || !form.teacher) {
      setMsg("All required fields must be filled.");
      return false;
    }
    return true;
  };

  /** Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await createAssignment(form, token);
      navigate("/admin/assignment");
    } catch (err) {
      console.log(err);
      setMsg("Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Assign Teacher to Course
      </h2>

      {msg && <p className="mb-3 text-red-500 font-medium">{msg}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Section */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Section</label>
          <input
            name="section"
            value={form.section}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Stream */}
        <div>
          <label className="text-gray-700 dark:text-gray-300">Stream</label>
          <select
            name="stream"
            value={form.stream}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
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
  className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
>
  <option value="">Select Course</option>

  {courses
    .filter(c =>
      (!form.grade || c.gradeLevel == form.grade) &&
      (!form.stream || c.stream === form.stream || c.stream === "None")
    )
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
            className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select Teacher</option>

            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.fullName  } : {t.subject}
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
            {loading ? "Saving..." : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
