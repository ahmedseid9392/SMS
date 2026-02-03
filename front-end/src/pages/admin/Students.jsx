import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getStudents, deleteStudent } from "../../api/studentService";
import StudentTable from "../../components/students/StudentTable";
import { useAuth } from "../../context/AuthContext";
import { Plus, ArrowLeft } from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    grade: "",
    section: "",
    stream: ""
  });

  // FIXED loadStudents()
  const loadStudents = async () => {
    try {
      const params = {};

      if (filters.username) params.username = filters.username;
      if (filters.grade) params.grade = filters.grade;
      if (filters.section) params.section = filters.section;
      if (filters.stream) params.stream = filters.stream;

      const res = await getStudents(user.token, params);

      setStudents(res.data.students || []);
    } catch (error) {
      console.error("Failed to load students", error);
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, [filters]); // Auto-refresh

  const handleDelete = async (id) => {
    await deleteStudent(id, user.token);
    toast.success("Student deleted successfully!");
    loadStudents();
  };
  const handleEdit = (id) => {
  navigate(`/admin/students/edit/${id}`);
};


  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
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

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Students</h1>
        </div>

        <button
          onClick={() => navigate("/admin/students/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-3">
        <input
          placeholder="Search Username"
          className="border p-2 rounded bg-white dark:bg-gray-800 
             text-gray-900 dark:text-gray-100 
             border-gray-300 dark:border-gray-600"
          value={filters.username}
          onChange={(e) =>
            setFilters({ ...filters, username: e.target.value })
          }
        />

        <input
          placeholder="Grade"
          className="border p-2 rounded bg-white dark:bg-gray-800 
             text-gray-900 dark:text-gray-100 
             border-gray-300 dark:border-gray-600"
          value={filters.grade}
          onChange={(e) =>
            setFilters({ ...filters, grade: e.target.value })
          }
        />

        <input
          placeholder="Section"
          className="border p-2 rounded bg-white dark:bg-gray-800 
             text-gray-900 dark:text-gray-100 
             border-gray-300 dark:border-gray-600"
          value={filters.section}
          onChange={(e) =>
            setFilters({ ...filters, section: e.target.value })
          }
        />

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800 
             text-gray-900 dark:text-gray-100 
             border-gray-300 dark:border-gray-600"
          value={filters.stream}
          onChange={(e) =>
            setFilters({ ...filters, stream: e.target.value })
          }
        >
          <option value="">All Streams</option>
          <option value="Natural">Natural</option>
          <option value="Social">Social</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg max-h-[480px] overflow-y-auto">
      <StudentTable
  students={students}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>

      </div>
    </div>
  );
}
