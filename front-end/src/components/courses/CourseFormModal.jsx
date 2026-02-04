import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  updateCourse,
  getCourseById,
} from "../../api/courseService";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
     gradeLevel: "",
    stream: "",
  });

  const isEdit = Boolean(id);

  // LOAD COURSE IF EDIT MODE
 useEffect(() => {
  if (isEdit) {
    (async () => {
      try {
        const res = await getCourseById(id);

        // API returns: { course: {...} }
        const course =
          res.course ||           // direct
          res.data?.course ||     // axios wrapped
          res.data ||             // fallback
          null;

        if (!course) {
          console.error("Invalid API response:", res);
          return;
        }

        setForm({
          name: course.name || "",
          gradeLevel: course.gradeLevel?.toString() || "",
          stream: course.stream || "",
        });
      } catch (err) {
        console.error("Failed to load course", err);
      }
    })();
  }
}, [id]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateCourse(id, form);
      } else {
        await createCourse(form);
      }

      navigate("/admin/courses");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save course");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {isEdit ? "Edit Course" : "New Course"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="font-semibold">Course Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Grade</label>
          <select
              name="gradeLevel"
            value={form.gradeLevel}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select grade</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>

        {(form.gradeLevel === "11" || form.gradeLevel === "12") && (
          <div>
            <label className="font-semibold">Stream</label>
            <select
              name="stream"
              value={form.stream}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select stream</option>
              <option value="Natural">Natural</option>
              <option value="Social">Social</option>
            </select>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
