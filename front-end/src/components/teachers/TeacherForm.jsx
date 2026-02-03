import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  createTeacher,
  updateTeacher,
  getTeacherById
} from "../../api/teacherService";

export default function TeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    subject: "",
    phone: ""
  });

  // -------- LOAD TEACHER WHEN EDITING --------
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getTeacherById(id, user.token)
      .then((res) => {
        if (res?.data) {
          setForm({
            fullName: res.data.fullName || "",
            subject: res.data.subject || "",
            phone: res.data.phone || ""
          });
        }
      })
      .catch(() => toast.error("Failed to load teacher"))
      .finally(() => setLoading(false));
  }, [id, user.token]);

  // -------- SUBMIT --------
  const submit = async () => {
    if (!form.fullName || !form.subject) {
      toast.error("Full Name and Subject are required");
      return;
    }

    try {
      if (id) {
        await updateTeacher(id, form, user.token);
      } else {
        await createTeacher(form, user.token);
      }

      toast.success("Teacher saved successfully!");
      navigate("/admin/teachers");
    } catch (err) {
      toast.error("Save failed");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow w-full max-w-lg">
        
        <h2 className="font-semibold mb-4 dark:text-white">
          {id ? "Edit Teacher" : "Add Teacher"}
        </h2>

        <input
          placeholder="Full Name"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:text-white"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          placeholder="Subject"
          className="border p-2 w-full mb-2 dark:bg-gray-800 dark:text-white"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mb-4 dark:bg-gray-800 dark:text-white"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate("/admin/teachers")}
            className="px-3 py-2 dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
