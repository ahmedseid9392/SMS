import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTeachers, deleteTeacher } from "../../api/teacherService";
import TeacherTable from "../../components/teachers/TeacherTable";
import { useAuth } from "../../context/AuthContext";
import { Plus, ArrowLeft } from "lucide-react";

export default function Teachers() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    subject: "",
  });

  const loadTeachers = async () => {
    try {
      const params = {};

      if (filters.name) params.name = filters.name;
      if (filters.subject) params.subject = filters.subject;

      const res = await getTeachers(user.token, params);

      setTeachers(res.data.teachers || []);
    } catch (error) {
      toast.error("Failed to load teachers");
      console.error("Load error:", error);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [filters]);

  const handleDelete = async (id) => {
    await deleteTeacher(id, user.token);
    toast.success("Teacher deleted successfully");
    loadTeachers();
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-200 mx-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-semibold dark:text-white">Teachers</h1>
        </div>

        <button
          onClick={() => navigate("/admin/teachers/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Search by name"
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <input
          placeholder="Subject"
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          value={filters.subject}
          onChange={(e) =>
            setFilters({ ...filters, subject: e.target.value })
          }
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg max-h-[480px] overflow-y-auto dark:border-gray-700">
        <TeacherTable teachers={teachers} onDelete={handleDelete} />
      </div>
    </div>
  );
}
