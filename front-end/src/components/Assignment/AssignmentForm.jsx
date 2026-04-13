import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeachers } from "../../api/teacherService";
import { getCourses } from "../../api/courseService";
import {
  createAssignment,
  updateAssignment,
  getAssignmentById,
} from "../../api/TeacherAssignmentService";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { X, Save, Plus, Edit, BookOpen, Users, GraduationCap, Layers, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

const AssignmentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const token = user?.token;

  const isEdit = Boolean(id);

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [form, setForm] = useState({
    grade: "",
    section: "",
    stream: "",
    course: "",
    teacher: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadData = async () => {
    try {
      const t = await getTeachers(token);
      const c = await getCourses(token);

      const teacherList = t?.teachers || t?.data?.teachers || t?.data || (Array.isArray(t) ? t : []);
      const courseList = c?.courses || c?.data || (Array.isArray(c) ? c : []);

      setTeachers(teacherList);
      setCourses(courseList);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      toast.error("Failed to load teachers or courses");
    }
  };

  const loadAssignment = async () => {
    try {
      const res = await getAssignmentById(id);
      const a = res?.assignment || res?.data?.assignment || res?.data || res;

      if (!a) {
        console.error("Invalid assignment response:", res);
        return;
      }

      setForm({
        grade: a.grade || "",
        section: a.section || "",
        stream: a.stream || "",
        course: a.course?._id || "",
        teacher: a.teacher?._id || "",
      });
      toast.success("Assignment data loaded");
    } catch (err) {
      console.error("LOAD EDIT ERROR:", err);
      toast.error("Failed to load assignment");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit && teachers.length > 0 && courses.length > 0) {
      loadAssignment();
    }
  }, [isEdit, teachers, courses]);

  const validate = () => {
    if (!form.grade) {
      toast.error("Please select a grade");
      return false;
    }
    if (!form.section) {
      toast.error("Please enter section");
      return false;
    }
    if (!form.course) {
      toast.error("Please select a course");
      return false;
    }
    if (!form.teacher) {
      toast.error("Please select a teacher");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await updateAssignment(id, form, token);
        toast.success("Assignment updated successfully!");
      } else {
        await createAssignment(form, token);
        toast.success("Assignment created successfully!");
      }
      setConfirmModalOpen(false);
      navigate("/admin/assignment");
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      toast.error(`Failed to ${isEdit ? "update" : "create"} assignment`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (validate()) {
      setConfirmModalOpen(true);
    }
  };

  // Filter courses based on grade and stream
  const filteredCourses = courses.filter((c) => {
    if (!form.grade) return true;
    if (c.gradeLevel != form.grade) return false;
    if (!form.stream) return true;
    return c.stream === form.stream || c.stream === "None";
  });

  // Filter teachers based on subject and grade
  const filteredTeachers = teachers.filter((t) => {
    if (!form.course) return true;
    const selectedCourse = courses.find(c => c._id === form.course);
    if (!selectedCourse) return true;
    return t.subjects?.includes(selectedCourse.name);
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 animate-slideUp max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {isEdit ? <Edit size={20} className="text-white" /> : <UserCheck size={20} className="text-white" />}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {isEdit ? "Edit Assignment" : "Assign Teacher to Course"}
              </h2>
            </div>
            
            <button
              onClick={() => navigate("/admin/assignment")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grade */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                  >
                    <option value="">Select Grade</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  placeholder="e.g., A, B, C"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                />
              </div>

              {/* Stream */}
              {(form.grade === "11" || form.grade === "12") && (
                <div>
                  <label className="block text-sm font-medium mb-2">Stream</label>
                  <div className="relative">
                    <Layers size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                    <select
                      name="stream"
                      value={form.stream}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        background: "var(--bg)", 
                        color: "var(--text)", 
                        border: "1px solid var(--border)" 
                      }}
                    >
                      <option value="">Select Stream</option>
                      <option value="Natural">Natural Science</option>
                      <option value="Social">Social Science</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Course */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                  >
                    <option value="">Select Course</option>
                    {filteredCourses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} (Grade {c.gradeLevel}{c.stream && c.stream !== "None" ? `, ${c.stream}` : ""})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Teacher <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <select
                    name="teacher"
                    value={form.teacher}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                  >
                    <option value="">Select Teacher</option>
                    {filteredTeachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName} - {t.subjects?.join(", ") || t.subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end gap-3 p-6 border-t dark:border-gray-700">
            <button
              onClick={() => navigate("/admin/assignment")}
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
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                       transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
                       flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : (isEdit ? "Update Assignment" : "Create Assignment")}
            </button>
          </div>
        </div>
      </div>

      {/* Save/Update Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        title={isEdit ? "Update Assignment" : "Create Assignment"}
        message={`Are you sure you want to ${isEdit ? "update" : "create"} this assignment?`}
        subtitle={`Grade ${form.grade} - Section ${form.section}`}
        type={isEdit ? "update" : "save"}
        loading={saving}
      />
    </>
  );
};

export default AssignmentForm;