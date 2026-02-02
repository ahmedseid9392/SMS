import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function StudentTable({ students, onDelete }) {
  const navigate = useNavigate();




  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th>Username</th>
          <th>Password</th>
          <th>Full Name</th>
          <th>Sex</th>
          <th>Grade</th>
          <th>Section</th>
          <th>Stream</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
  {students?.length ? (
    students.map((s) => (
      <tr key={s._id}>
        <td>{s.username}</td>
        <td>Default</td>
        <td>{s.fullName}</td>
        <td>{s.sex}</td>
        <td>{s.grade}</td>
        <td>{s.section}</td>
        <td>{s.stream || "-"}</td>
        <td className="flex gap-2">
          <button onClick={() => navigate(`/admin/students/edit/${s._id}`)}>
            <FaEdit className="text-blue-400"/>
          </button>
          <button onClick={() => onDelete(s._id)}>
            <FaTrash className="text-red-400"/>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center py-4">No students found</td>
    </tr>
  )}
</tbody>

    </table>
  );
}
