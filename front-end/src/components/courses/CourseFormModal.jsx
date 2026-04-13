import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  updateCourse,
  getCourseById,
} from "../../api/courseService";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import { X, Save, Plus, Edit, BookOpen, GraduationCap, Layers } from "lucide-react";
import toast from "react-hot-toast";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gradeLevel: "",
    stream: "",
  });

  const isEdit = Boolean(id);

  // LOAD COURSE IF EDIT MODE
  useEffect(() => {
    if (isEdit) {
      const loadCourse = async () => {
        setLoading(true);
        try {
          const res = await getCourseById(id);
          
          // Handle different response structures
          const course = res.course || res.data?.course || res.data || res;
          
          if (!course) {
            toast.error("Course not found");
            navigate("/admin/courses");
            return;
          }

          setForm({
            name: course.name || "",
            gradeLevel: course.gradeLevel?.toString() || "",
            stream: course.stream || "",
          });
          
          toast.success("Course data loaded");
        } catch (err) {
          console.error("Failed to load course", err);
          toast.error("Failed to load course data");
          navigate("/admin/courses");
        } finally {
          setLoading(false);
        }
      };
      
      loadCourse();
    }
  }, [id, navigate, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Course name is required");
      return false;
    }
    if (!form.gradeLevel) {
      toast.error("Please select a grade level");
      return false;
    }
    if ((form.gradeLevel === "11" || form.gradeLevel === "12") && !form.stream) {
      toast.error("Stream is required for grades 11 and 12");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      if (isEdit) {
        await updateCourse(id, form);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(form);
        toast.success("Course created successfully!");
      }
      
      setConfirmModalOpen(false);
      navigate("/admin/courses");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(`Failed to ${isEdit ? "update" : "create"} course`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setConfirmModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 animate-slideUp">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {isEdit ? <Edit size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {isEdit ? "Edit Course" : "Add New Course"}
              </h2>
            </div>
            
            <button
              onClick={() => navigate("/admin/courses")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <div className="grid gap-4">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter course name"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    required
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <select
                    name="gradeLevel"
                    value={form.gradeLevel}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    required
                  >
                    <option value="">Select grade</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
              </div>

              {/* Stream (Conditional) */}
              {(form.gradeLevel === "11" || form.gradeLevel === "12") && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stream <span className="text-red-500">*</span>
                  </label>
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
                      required
                    >
                      <option value="">Select stream</option>
                      <option value="Natural">Natural Science</option>
                      <option value="Social">Social Science</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">
            <button
              onClick={() => navigate("/admin/courses")}
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
              {saving ? "Saving..." : (isEdit ? "Update Course" : "Save Course")}
            </button>
          </div>
        </div>
      </div>

      {/* Save/Update Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        title={isEdit ? "Update Course" : "Save Course"}
        message={`Are you sure you want to ${isEdit ? "update" : "save"} this course?`}
        subtitle={`Course: ${form.name}`}
        type={isEdit ? "update" : "save"}
        loading={saving}
      />
    </>
  );
};

export default CourseForm;