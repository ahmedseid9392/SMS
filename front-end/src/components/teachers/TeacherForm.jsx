import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import {
  createTeacher,
  updateTeacher,
  getTeacherById
} from "../../api/teacherService";
import { X, Save, UserPlus, Edit, User, BookOpen, Phone, Mail, MapPin, GraduationCap } from "lucide-react";

export default function TeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState(null); // Track if data is loaded

  const [form, setForm] = useState({
    fullName: "",
    subject: "",
    phone: "",
    email: "",
    qualification: "",
    address: "",
    specialization: "",
    gradeLevels: [],
    stream: ""
  });

  // Load teacher data when editing
  useEffect(() => {
    if (!id) return;

    const loadTeacher = async () => {
      setLoading(true);
      try {
        console.log("Loading teacher with ID:", id);
        console.log("User token:", user.token);
        
        const response = await getTeacherById(id, user.token);
        console.log("API Response:", response);
        
        // Handle different response structures
        let teacherData = response.data || response;
        
        if (teacherData.data) {
          teacherData = teacherData.data;
        }
        
        console.log("Teacher data to populate:", teacherData);
        
        // Populate form with existing data
        setForm({
          fullName: teacherData.fullName || "",
          subject: teacherData.subjects?.[0] || teacherData.subject || "",
          phone: teacherData.phone || "",
          email: teacherData.email || "",
          qualification: teacherData.qualification || "",
          address: teacherData.address || "",
          specialization: teacherData.specialization || "",
          gradeLevels: teacherData.gradeLevels || [],
          stream: teacherData.stream || "None"
        });
        
        setFormData(true);
        toast.success("Teacher data loaded");
        
      } catch (error) {
        console.error("Failed to load teacher:", error);
        console.error("Error details:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to load teacher data");
        navigate("/admin/teachers");
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [id, user.token, navigate]);

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error("Full Name is required");
      return false;
    }
    if (!form.subject.trim()) {
      toast.error("Subject is required");
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      const teacherData = {
        fullName: form.fullName,
        subjects: [form.subject],
        phone: form.phone,
        email: form.email,
        qualification: form.qualification,
        address: form.address,
        specialization: form.specialization,
        gradeLevels: form.gradeLevels,
        stream: form.stream
      };
      
      if (id) {
        await updateTeacher(id, teacherData, user.token);
        toast.success("Teacher updated successfully!");
      } else {
        await createTeacher(teacherData, user.token);
        toast.success("Teacher created successfully!");
      }
      
      setConfirmModalOpen(false);
      navigate("/admin/teachers");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Failed to ${id ? "update" : "create"} teacher: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setConfirmModalOpen(true);
    }
  };

  const handleGradeChange = (grade) => {
    setForm(prev => {
      const grades = prev.gradeLevels.includes(grade)
        ? prev.gradeLevels.filter(g => g !== grade)
        : [...prev.gradeLevels, grade];
      return { ...prev, gradeLevels: grades };
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading teacher data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 transform transition-all duration-300 animate-slideUp max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-6 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                {id ? <Edit size={20} className="text-white" /> : <UserPlus size={20} className="text-white" />}
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {id ? "Edit Teacher" : "Add New Teacher"}
              </h2>
            </div>
            
            <button
              onClick={() => navigate("/admin/teachers")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    placeholder="e.g., Mathematics, Physics"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <select
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  >
                    <option value="">Select Qualification</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <input
                  placeholder="e.g., Mathematics Education"
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    type="email"
                    placeholder="teacher@school.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                  <input
                    placeholder="Phone number"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Grade Levels */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Grade Levels
                </label>
                <div className="flex gap-4 flex-wrap">
                  {[9, 10, 11, 12].map(grade => (
                    <label key={grade} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.gradeLevels?.includes(grade) || false}
                        onChange={() => handleGradeChange(grade)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Grade {grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stream */}
              <div>
                <label className="block text-sm font-medium mb-2">Stream</label>
                <select
                  className="w-full px-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    background: "var(--bg)", 
                    color: "var(--text)", 
                    border: "1px solid var(--border)" 
                  }}
                  value={form.stream}
                  onChange={(e) => setForm({ ...form, stream: e.target.value })}
                >
                  <option value="None">None</option>
                  <option value="Natural">Natural Science</option>
                  <option value="Social">Social Science</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 opacity-50" />
                  <textarea
                    placeholder="Enter address"
                    rows="2"
                    className="w-full pl-10 pr-4 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ 
                      background: "var(--bg)", 
                      color: "var(--text)", 
                      border: "1px solid var(--border)" 
                    }}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end gap-3 p-6 border-t dark:border-gray-700">
            <button
              onClick={() => navigate("/admin/teachers")}
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
              {saving ? "Saving..." : (id ? "Update Teacher" : "Save Teacher")}
            </button>
          </div>
        </div>
      </div>

      {/* Save/Update Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        title={id ? "Update Teacher" : "Save Teacher"}
        message={`Are you sure you want to ${id ? "update" : "save"} this teacher?`}
        subtitle={`Please verify the information for ${form.fullName} before proceeding.`}
        type={id ? "update" : "save"}
        loading={saving}
      />
    </>
  );
}