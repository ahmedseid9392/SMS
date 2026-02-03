import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  updateCourse,
  getCourseById
} from "../../api/courseService";
import { getTeachers } from "../../api/teacherService";

const CourseForm = () => {
  const { id } = useParams(); // if exists → EDIT MODE
  const navigate = useNavigate();

  //const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    grade: "",
    stream: ""
   
  });

  const isEdit = Boolean(id);

  // LOAD TEACHERS
  // useEffect(() => {
  //   const loadTeachers = async () => {
  //     const data = await getTeachers();
  //     setTeachers(data.teachers);
  //   };
  //   loadTeachers();
  // }, []);

  // LOAD COURSE IF EDITING
  useEffect(() => {
    if (isEdit) {
      (async () => {
        const data = await getCourseById(id);
        setForm({
          name: data.name,
          grade: data.grade,
          stream: data.stream || ""
          //teacher: data.teacher?._id || ""
        });
      })();
    }
  }, [id]);

  // UPDATE FORM
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) await updateCourse(id, form);
    else await createCourse(form);

    navigate("/admin/courses");
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
            name="grade"
            value={form.grade}
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

        {(form.grade === "11" || form.grade === "12") && (
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

        {/* <div>
          <label className="font-semibold">Teacher</label>
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">No Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div> */}

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
