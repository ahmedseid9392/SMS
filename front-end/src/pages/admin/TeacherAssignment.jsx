import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus,ArrowLeft } from "lucide-react";
import AssignmentTable from "../../components/Assignment/AssignmentTable";
import { getAssignments, deleteAssignment } from "../../api/TeacherAssignmentService";

const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAssignments();

      console.log("Assignments Loaded:", data);

      // Must return an array
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load error:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await deleteAssignment(id);
      loadAssignments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/assignment/edit/${id}`);
  };

  return (
    <div className="p-4">
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
          onClick={() => navigate("/admin/assignment/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
         

          <Plus size={18} /> Add Course
        </button>
      </div>
      <AssignmentTable
        assignments={assignments}
        onDelete={handleDelete}
        onEdit={handleEdit}
        loading={loading}
      />
    </div>
  );
};

export default TeacherAssignment;
