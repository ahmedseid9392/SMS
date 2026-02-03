import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  createStudent,
  updateStudent,
  getStudentById
} from "../../api/studentService";
import Select from "react-select";
import api from "../../api/axios";

export default function StudentFormModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    sex: "",
    grade: "",
    section: "",
    stream: "",
    courses: []
  });

  // Load all courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    loadCourses();
  }, []);

  // If Editing: Load student
  useEffect(() => {
    if (id) {
      getStudentById(id, user.token)
        .then((res) => {
          setForm({
            ...res.data,
            courses: res.data.courses?.map((c) => c._id) || []
          });

          filterCourses(res.data.grade, res.data.stream);
        })
        .catch((err) => console.error(err));
    }
  }, [id, user.token]);

  // Filter courses based on grade + stream
  const filterCourses = (grade, stream) => {
    if (!grade) return;

    let filtered = courses.filter((c) => c.gradeLevel == grade);

    if ((grade == 11 || grade == 12) && stream) {
      filtered = filtered.filter((c) => c.stream === stream);
    }

    setFilteredCourses(
      filtered.map((c) => ({
        value: c._id,
        label: `${c.name} (${c.teacher?.name || "No Teacher"})`
      }))
    );
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (e.target.name === "grade" || e.target.name === "stream") {
      filterCourses(updated.grade, updated.stream);
    }
  };

  const handleCourseSelect = (selected) => {
    setForm({
      ...form,
      courses: selected ? selected.map((s) => s.value) : []
    });
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.sex || !form.grade || !form.section) {
      toast.error("Please fill all required fields");
      return;
    }

    if ((form.grade == 11 || form.grade == 12) && !form.stream) {
      toast.error("Stream is required for grade 11 & 12");
      return;
    }

    try {
      if (id) {
        await updateStudent(id, form, user.token);
        toast.success("Student updated!");
      } else {
        await createStudent(form, user.token);
        toast.success("Student created!");
      }

      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save student");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-lg text-black dark:text-white">
        <h2 className="font-semibold mb-4">
          {id ? "Edit Student" : "Add Student"}
        </h2>

        <input
          name="fullName"
          placeholder="Full Name"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:border-gray-700"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <select
          name="sex"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:border-gray-700"
          value={form.sex}
          onChange={handleChange}
          required
        >
          <option value="">Sex</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          name="grade"
          placeholder="Grade"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:border-gray-700"
          value={form.grade}
          onChange={handleChange}
          required
        />

        {(form.grade == 11 || form.grade == 12) && (
          <select
            name="stream"
            className="border p-2 w-full mb-2 dark:bg-gray-800 dark:border-gray-700"
            value={form.stream}
            onChange={handleChange}
            required
          >
            <option value="">Select Stream</option>
            <option value="Natural">Natural</option>
            <option value="Social">Social</option>
          </select>
        )}

        <input
          name="section"
          placeholder="Section"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:border-gray-700"
          value={form.section}
          onChange={handleChange}
          required
        />

        <label className="block mb-1 font-semibold">Courses</label>
        <Select
          options={filteredCourses}
          isMulti
          value={filteredCourses.filter((c) => form.courses.includes(c.value))}
          onChange={handleCourseSelect}
          className="text-black dark:text-white mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/admin/students")}
            className="px-4 py-2 bg-gray-400 dark:bg-gray-700 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
