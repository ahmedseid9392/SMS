import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  createStudent,
  updateStudent,
  getStudentById
} from "../../api/studentService";
import Select from "react-select";
import api from "../../api/axios";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { X, Save, UserPlus, Edit } from "lucide-react";

export default function StudentFormModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    sex: "",
    grade: "",
    section: "",
    stream: "",
    courses: []
  });

  // Load all courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error loading courses:", err);
        toast.error("Failed to load courses");
      }
    };
    loadCourses();
  }, []);

  // If Editing: Load student
  useEffect(() => {
    if (id) {
      getStudentById(id, user.token)
        .then((res) => {
          setForm({
            ...res.data,
            courses: res.data.courses?.map((c) => c._id) || []
          });
          filterCourses(res.data.grade, res.data.stream);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load student data");
        });
    }
  }, [id, user.token]);

  // Filter courses based on grade + stream
  const filterCourses = (grade, stream) => {
    if (!grade) return;

    let filtered = courses.filter((c) => c.gradeLevel == grade);

    if ((grade == 11 || grade == 12) && stream) {
      filtered = filtered.filter((c) => c.stream === stream);
    }

    setFilteredCourses(
      filtered.map((c) => ({
        value: c._id,
        label: `${c.name} (${c.teacher?.name || "No Teacher"})`
      }))
    );
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (e.target.name === "grade" || e.target.name === "stream") {
      filterCourses(updated.grade, updated.stream);
    }
  };

  const handleCourseSelect = (selected) => {
    setForm({
      ...form,
      courses: selected ? selected.map((s) => s.value) : []
    });
  };

  const validateForm = () => {
    if (!form.fullName || !form.sex || !form.grade || !form.section) {
      toast.error("Please fill all required fields");
      return false;
    }

    if ((form.grade == 11 || form.grade == 12) && !form.stream) {
      toast.error("Stream is required for grade 11 & 12");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (id) {
        await updateStudent(id, form, user.token);
        toast.success("Student updated successfully!");
      } else {
        await createStudent(form, user.token);
        toast.success("Student created successfully!");
      }
      
      setConfirmModalOpen(false);
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${id ? "update" : "create"} student`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setConfirmModalOpen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 animate-slideUp">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {id ? <Edit size={20} className="text-white" /> : <UserPlus size={20} className="text-white" />}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {id ? "Edit Student" : "Add New Student"}
              </h2>
            </div>
            
            <button
              onClick={() => navigate("/admin/students")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  name="fullName"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sex *</label>
                <select
                  name="sex"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Grade *</label>
                <input
                  name="grade"
                  placeholder="e.g., 9, 10, 11, 12"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.grade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Section *</label>
                <input
                  name="section"
                  placeholder="e.g., A, B, C"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.section}
                  onChange={handleChange}
                  required
                />
              </div>

              {(form.grade == 11 || form.grade == 12) && (
                <div>
                  <label className="block text-sm font-medium mb-2">Stream *</label>
                  <select
                    name="stream"
                    className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.stream}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Stream</option>
                    <option value="Natural">Natural Science</option>
                    <option value="Social">Social Science</option>
                  </select>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Courses</label>
                <Select
                  options={filteredCourses}
                  isMulti
                  value={filteredCourses.filter((c) => form.courses.includes(c.value))}
                  onChange={handleCourseSelect}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select courses..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      padding: "2px"
                    }),
                    menu: (base) => ({
                      ...base,
                      background: "var(--card)",
                      border: "1px solid var(--border)"
                    }),
                    option: (base, state) => ({
                      ...base,
                      background: state.isFocused ? "var(--primary)" : "var(--card)",
                      color: state.isFocused ? "white" : "var(--text)"
                    })
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">
            <button
              onClick={() => navigate("/admin/students")}
              className="px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ 
                background: "var(--bg)", 
                color: "var(--text)", 
                border: "1px solid var(--border)" 
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSaveClick}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                       transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
                       flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? "Saving..." : (id ? "Update Student" : "Save Student")}
            </button>
          </div>
        </div>
      </div>

      {/* Save/Update Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        title={id ? "Update Student" : "Save Student"}
        message={`Are you sure you want to ${id ? "update" : "save"} this student?`}
        subtitle={`Please verify the information for ${form.fullName} before proceeding.`}
        type={id ? "update" : "save"}
        loading={loading}
      />
    </>
  );
}