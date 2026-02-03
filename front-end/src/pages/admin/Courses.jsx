import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import ThemedCard from "../../components/ui/ThemedCard";
import CourseTable from "../../components/courses/CourseTable";
import CourseFormModal from "../../components/courses/CourseFormModal";
import { getCourses, deleteCourse } from "../../api/courseService";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    const res = await getCourses(user.token);
    setCourses(res.data || []);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    await deleteCourse(id, user.token);
    toast.success("Course deleted!");
    loadCourses();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <ThemedCard>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold dark:text-white">Courses</h1>

            <button
              onClick={() => {
                setEditingCourse(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={18} /> Add Course
            </button>
          </div>
        </ThemedCard>

        <div className="mt-6 border rounded-lg dark:border-gray-700 overflow-auto">
          <CourseTable
            courses={courses}
            onEdit={(c) => {
              setEditingCourse(c);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {showModal && (
          <CourseFormModal
            course={editingCourse}
            token={user.token}
            onSaved={loadCourses}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </Layout>
  );
}
