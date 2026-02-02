import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getStudents,
  deleteStudent
} from "../../api/studentService";
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

  // 🔥 Load with filters (real-time)
  const loadStudents = async () => {
    const res = await getStudents(user.token, filters);
    setStudents(res.data.students || []);
  };

  useEffect(() => {
    loadStudents();
  }, [filters]); // 🔥 Auto refresh when filter changes

  const handleDelete = async (id) => {
    await deleteStudent(id, user.token);
     toast.success("Student deleted successfully!");
    loadStudents();
  };

  return (
    <div className="p-6 space-y-4">

      {/* ⭐ Header */}
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-3n">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-200 mx-2 hover:bg-gray-300 rounded"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-semibold">Students</h1>
        </div>

        <button
          onClick={() => navigate("/admin/students/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* ⭐ FILTERS */}
      <div className="grid grid-cols-4 gap-3">
        <input
          placeholder="Search Username"
          className="border p-2 rounded"
          value={filters.username}
          onChange={(e) =>
            setFilters({ ...filters, username: e.target.value })
          }
        />

        <input
          placeholder="Grade"
          className="border p-2 rounded"
          value={filters.grade}
          onChange={(e) =>
            setFilters({ ...filters, grade: e.target.value })
          }
        />

        <input
          placeholder="Section"
          className="border p-2 rounded"
          value={filters.section}
          onChange={(e) =>
            setFilters({ ...filters, section: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
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

      {/* ⭐ TABLE WITH SCROLL */}
      <div className="border rounded-lg max-h-[480px] overflow-y-auto">
        <StudentTable students={students} onDelete={handleDelete} />
      </div>
    </div>
  );
}
