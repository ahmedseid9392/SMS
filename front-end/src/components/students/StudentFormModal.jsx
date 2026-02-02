import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  createStudent,
  updateStudent,
  getStudentById
} from "../../api/studentService";

export default function StudentFormModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();   // ✅ GET LOGGED USER + TOKEN

  const [form, setForm] = useState({
    fullName: "",
    sex: "",
    grade: "",
    section: "",
    stream: "",
    courses: []
  });

  useEffect(() => {
    if (id) {
      getStudentById(id, user.token)      // ✅ SEND TOKEN
        .then(res => setForm(res.data))
        .catch(err => console.error(err));
    }
  }, [id, user.token]);

  const submit = async () => {
  if (!form.fullName || !form.sex || !form.grade || !form.section) {
    alert("Please fill all required fields.");
    return;
  }

  if ((form.grade == 11 || form.grade == 12) && !form.stream) {
    alert("Stream is required for grade 11 and 12.");
    return;
  }

  try {
    if (id) await updateStudent(id, form, user.token);
    else await createStudent(form, user.token);

    navigate("/admin/students");
  } catch (err) {
    console.error(err);
    alert("Failed to save student.");
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="font-semibold mb-4">
          {id ? "Edit Student" : "Add Student"}
        </h2>

        <input
          placeholder="Full Name"
          className="border p-2 w-full mb-2"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-2"
          value={form.sex}
          onChange={e => setForm({ ...form, sex: e.target.value })}
        >
          <option value="">Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          placeholder="Grade"
          className="border p-2 w-full mb-2"
          value={form.grade}
         onChange={e => setForm({ ...form, grade: Number(e.target.value) })}

        />

        {(form.grade == 11 || form.grade == 12) && (
          <select
            className="border p-2 w-full mb-2"
            value={form.stream}
            onChange={e => setForm({ ...form, stream: e.target.value })}
          >
            <option value="">Stream</option>
            <option value="Natural">Natural</option>
            <option value="Social">Social</option>
          </select>
        )}

        <input
          placeholder="Section"
          className="border p-2 w-full mb-4"
          value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={() => navigate("/admin/students")}>Cancel</button>
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
