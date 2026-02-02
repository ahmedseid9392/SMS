import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents , deleteStudent} from "../../api/studentService";
import StudentTable from "../../components/students/StudentTable";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
   const { user } = useAuth();
  const [filters, setFilters] = useState({
    username: "",
    grade: "",
    section: "",
    stream: ""
  });

  const loadStudents = async () => {
    const res = await getStudents(user.token);
    setStudents(res.data.students || []);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Students</h1>

        <button
          onClick={() => navigate("/admin/students/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <input placeholder="Username"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, username: e.target.value })}
        />
        <input placeholder="Grade"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
        />
        <input placeholder="Section"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
        />
        <select
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, stream: e.target.value })}
        >
          <option value="">All Streams</option>
          <option value="Natural">Natural</option>
          <option value="Social">Social</option>
        </select>
      </div>

      <StudentTable students={students || []} onDelete={handleDelete} />

    </div>
  );
}
