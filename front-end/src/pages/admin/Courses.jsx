import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../../api/courseService";
import { ArrowLeft, Plus } from "lucide-react";
import CourseTable from "../../components/courses/CourseTable";
import { useAuth } from "../../context/AuthContext";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
const loadCourses = async () => {
  try {
    const data = await getCourses();   // data IS array
    setCourses(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to load courses", err);
    setCourses([]);
  }
};





  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    await deleteCourse(id);
    loadCourses();
  };

  const handleEdit = (course) => {
    navigate(`/admin/courses/edit/${course._id}`);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 px-4 py-2 
           bg-blue-200 dark:bg-blue-800 
           hover:bg-blue-300 dark:hover:bg-blue-700 
           text-gray-900 dark:text-white 
           rounded"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold">Courses</h1>

        <button
          onClick={() => navigate("/admin/courses/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
         

          <Plus size={18} /> Add Course
        </button>
      </div>

      <CourseTable
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Courses;
