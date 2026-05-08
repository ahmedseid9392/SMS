import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X,
  RefreshCw,
  Settings,
  TrendingUp,
  Award
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AcademicYearManagement = () => {
  const { user } = useAuth();
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [gradingSettings, setGradingSettings] = useState({
    midWeight: 0.15,
    quizWeight: 0.10,
    assignmentWeight: 0.25,
    finalWeight: 0.50
  });
  
  const [formData, setFormData] = useState({
    name: "",
    ethiopianYear: "",
    gregorianYear: "",
    calendar: "EC",
    startDateEC: "",
    endDateEC: "",
    startDateGC: "",
    endDateGC: "",
    semesters: [
      { semester: 1, name: "First Semester", isActive: true },
      { semester: 2, name: "Second Semester", isActive: false }
    ],
    status: "upcoming"
  });

  useEffect(() => {
    fetchAcademicYears();
    fetchGradingSettings();
  }, []);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await api.get('/academic-years');
      setAcademicYears(response.data.data || []);
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to load academic years");
    } finally {
      setLoading(false);
    }
  };

  const fetchGradingSettings = async () => {
    try {
      const response = await api.get('/grading-setting');
      setGradingSettings(response.data.setting || {
        midWeight: 0.15,
        quizWeight: 0.10,
        assignmentWeight: 0.25,
        finalWeight: 0.50
      });
    } catch (error) {
      console.error("Error fetching grading settings:", error);
    }
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'ethiopianYear') {
    // Just update the value as user types, don't auto-format during typing
    setFormData({ ...formData, [name]: value });
  } 
  else if (name === 'gregorianYear') {
    setFormData({ ...formData, [name]: value });
  }
  else {
    setFormData({ ...formData, [name]: value });
  }
};
  const handleSemesterChange = (index, field, value) => {
    const newSemesters = [...formData.semesters];
    newSemesters[index][field] = value;
    setFormData({ ...formData, semesters: newSemesters });
  };

  const handleGradingChange = (e) => {
    const { name, value } = e.target;
    setGradingSettings({ ...gradingSettings, [name]: parseFloat(value) || 0 });
  };

const saveAcademicYear = async () => {
  // Helper function to format Ethiopian year
  const formatEthiopianYear = (year) => {
    let formatted = year.trim();
    
    // If already has EC, return as is
    if (formatted.toLowerCase().includes('ec')) {
      return formatted;
    }
    
    // Extract year numbers
    const numbers = formatted.match(/\d{4}/g);
    if (!numbers) return formatted;
    
    if (numbers.length === 2) {
      return `${numbers[0]} - ${numbers[1]} EC`;
    } else {
      return `${numbers[0]} EC`;
    }
  };
  
  // Helper function to format Gregorian year
  const formatGregorianYear = (year) => {
    let formatted = year.trim();
    
    // If already has slash, return as is
    if (formatted.includes('/')) {
      return formatted;
    }
    
    // Check for dash format (2024-2025)
    const dashMatch = formatted.match(/^(\d{4})-(\d{4})$/);
    if (dashMatch) {
      return `${dashMatch[1]}/${dashMatch[2].slice(-2)}`;
    }
    
    // Check for single year
    const singleMatch = formatted.match(/^(\d{4})$/);
    if (singleMatch) {
      const nextYear = parseInt(singleMatch[1]) + 1;
      return `${singleMatch[1]}/${nextYear.toString().slice(-2)}`;
    }
    
    return formatted;
  };
  
  // Validate required fields
  if (!formData.name || !formData.ethiopianYear || !formData.gregorianYear) {
    toast.error("Please fill all required fields");
    return;
  }
  
  // Format the years
  const formattedEthiopianYear = formatEthiopianYear(formData.ethiopianYear);
  const formattedGregorianYear = formatGregorianYear(formData.gregorianYear);
  
  const submitData = {
    name: formData.name.trim(),
    ethiopianYear: formattedEthiopianYear,
    gregorianYear: formattedGregorianYear,
    calendar: formData.calendar,
    startDateEC: formData.startDateEC || null,
    endDateEC: formData.endDateEC || null,
    startDateGC: formData.startDateGC || null,
    endDateGC: formData.endDateGC || null,
    semesters: formData.semesters,
    status: formData.status
  };
  
  console.log("Submitting:", submitData);
  
  try {
    if (editingYear) {
      await api.put(`/academic-years/${editingYear._id}`, submitData);
      toast.success("Academic year updated successfully");
    } else {
      await api.post('/academic-years', submitData);
      toast.success("Academic year created successfully");
    }
    setShowModal(false);
    setEditingYear(null);
    resetForm();
    fetchAcademicYears();
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.response?.data?.message || "Failed to save academic year");
  }
};
  const saveGradingSettings = async () => {
    const total = gradingSettings.midWeight + gradingSettings.quizWeight + 
                  gradingSettings.assignmentWeight + gradingSettings.finalWeight;
    
    if (Math.abs(total - 1) > 0.01) {
      toast.error(`Weights must add up to 100%. Current total: ${(total * 100).toFixed(0)}%`);
      return;
    }
    
    try {
      await api.put('/grading-setting', gradingSettings);
      toast.success("Grading settings updated successfully");
      setShowGradeModal(false);
      fetchGradingSettings();
    } catch (error) {
      console.error("Error saving grading settings:", error);
      toast.error(error.response?.data?.message || "Failed to save grading settings");
    }
  };

  const setActiveYear = async (id) => {
    try {
      await api.put(`/academic-years/set-active/${id}`);
      toast.success("Academic year activated");
      fetchAcademicYears();
    } catch (error) {
      console.error("Error activating year:", error);
      toast.error("Failed to activate academic year");
    }
  };

  const deleteYear = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic year?")) return;
    
    try {
      await api.delete(`/academic-years/${id}`);
      toast.success("Academic year deleted");
      fetchAcademicYears();
    } catch (error) {
      console.error("Error deleting year:", error);
      toast.error(error.response?.data?.message || "Failed to delete academic year");
    }
  };

  const toggleSemester = async (id, semester) => {
    try {
      await api.put(`/academic-years/${id}/semester/${semester}/toggle`);
      toast.success(`Semester ${semester} toggled`);
      fetchAcademicYears();
    } catch (error) {
      console.error("Error toggling semester:", error);
      toast.error("Failed to toggle semester");
    }
  };

  const editYear = (year) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      ethiopianYear: year.ethiopianYear,
      gregorianYear: year.gregorianYear,
      calendar: year.calendar || "EC",
      startDateEC: year.startDateEC?.split('T')[0] || "",
      endDateEC: year.endDateEC?.split('T')[0] || "",
      startDateGC: year.startDateGC?.split('T')[0] || "",
      endDateGC: year.endDateGC?.split('T')[0] || "",
      semesters: year.semesters || [
        { semester: 1, name: "First Semester", isActive: true },
        { semester: 2, name: "Second Semester", isActive: false }
      ],
      status: year.status || "upcoming"
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ethiopianYear: "",
      gregorianYear: "",
      calendar: "EC",
      startDateEC: "",
      endDateEC: "",
      startDateGC: "",
      endDateGC: "",
      semesters: [
        { semester: 1, name: "First Semester", isActive: true },
        { semester: 2, name: "Second Semester", isActive: false }
      ],
      status: "upcoming"
    });
    setEditingYear(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Active' };
      case 'upcoming':
        return { color: 'bg-blue-100 text-blue-700', icon: Calendar, text: 'Upcoming' };
      case 'completed':
        return { color: 'bg-gray-100 text-gray-700', icon: CheckCircle, text: 'Completed' };
      case 'archived':
        return { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, text: 'Archived' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, text: status };
    }
  };

  const formatWeight = (weight) => {
    return `${(weight * 100).toFixed(0)}%`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg opacity-70">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Academic Year Management
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage academic years and grading settings</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowGradeModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Settings size={18} />
              Grading Settings
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add Academic Year
            </button>
          </div>
        </div>

        {/* Academic Years Table */}
        <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <th className="p-3 border text-left">Year Name</th>
                  <th className="p-3 border text-center">Ethiopian Year</th>
                  <th className="p-3 border text-center">Gregorian Year</th>
                  <th className="p-3 border text-center">Semester 1</th>
                  <th className="p-3 border text-center">Semester 2</th>
                  <th className="p-3 border text-center">Status</th>
                  <th className="p-3 border text-center">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {academicYears.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      No academic years found
                    </td>
                  </tr>
                ) : (
                  academicYears.map((year) => {
                    const statusBadge = getStatusBadge(year.status);
                    const StatusIcon = statusBadge.icon;
                    const sem1Active = year.semesters?.find(s => s.semester === 1)?.isActive;
                    const sem2Active = year.semesters?.find(s => s.semester === 2)?.isActive;
                    
                    return (
                      <tr key={year._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3 font-medium">{year.name}</td>
                        <td className="p-3 text-center">{year.ethiopianYear}</td>
                        <td className="p-3 text-center">{year.gregorianYear}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleSemester(year._id, 1)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                              sem1Active 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {sem1Active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleSemester(year._id, 2)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                              sem2Active 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {sem2Active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                            <StatusIcon size={12} />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            {!year.isActive && year.status !== 'active' && (
                              <button
                                onClick={() => setActiveYear(year._id)}
                                className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                                title="Activate"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => editYear(year)}
                              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteYear(year._id)}
                              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Settings Card */}
        <div className="rounded-2xl shadow-lg p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp size={20} />
              Current Grading Weights
            </h2>
            <button
              onClick={() => setShowGradeModal(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
            >
              <Settings size={14} className="inline mr-1" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm opacity-70">Mid Exam</p>
              <p className="text-2xl font-bold text-blue-600">{formatWeight(gradingSettings.midWeight)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-sm opacity-70">Quiz</p>
              <p className="text-2xl font-bold text-green-600">{formatWeight(gradingSettings.quizWeight)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm opacity-70">Assignment</p>
              <p className="text-2xl font-bold text-yellow-600">{formatWeight(gradingSettings.assignmentWeight)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <p className="text-sm opacity-70">Final Exam</p>
              <p className="text-2xl font-bold text-purple-600">{formatWeight(gradingSettings.finalWeight)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Year Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingYear ? 'Edit Academic Year' : 'Add Academic Year'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Year Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  placeholder="e.g., 2017 EC - 2018 EC"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Ethiopian Year *</label>
                 <input
  type="text"
  name="ethiopianYear"
  value={formData.ethiopianYear}
  onChange={handleInputChange}
  className="w-full px-3 py-2 rounded-lg"
  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
  placeholder="e.g., 2017 EC (must include EC)"
/>
<p className="text-xs text-red-500 mt-1">
  ⚠️ Important: You must include "EC" at the end (e.g., 2017 EC)
</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">Gregorian Year *</label>
                  <input
                    type="text"
                    name="gregorianYear"
                    value={formData.gregorianYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    placeholder="e.g., 2024/25"
                  />
                  <p className="text-xs opacity-50 mt-1">Format: YYYY/YY (e.g., 2024/25)</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Calendar Type</label>
                <select
                  name="calendar"
                  value={formData.calendar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  <option value="EC">Ethiopian Calendar (EC)</option>
                  <option value="GC">Gregorian Calendar (GC)</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date (EC)</label>
                  <input
                    type="date"
                    name="startDateEC"
                    value={formData.startDateEC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Date (EC)</label>
                  <input
                    type="date"
                    name="endDateEC"
                    value={formData.endDateEC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date (GC)</label>
                  <input
                    type="date"
                    name="startDateGC"
                    value={formData.startDateGC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Date (GC)</label>
                  <input
                    type="date"
                    name="endDateGC"
                    value={formData.endDateGC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Semesters</h3>
                {formData.semesters.map((sem, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      value={sem.name}
                      onChange={(e) => handleSemesterChange(idx, 'name', e.target.value)}
                      className="px-3 py-2 rounded-lg col-span-2"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                      placeholder="Semester Name"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sem.isActive}
                        onChange={(e) => handleSemesterChange(idx, 'isActive', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600">Cancel</button>
              <button onClick={saveAcademicYear} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Grading Settings Modal */}
      {showGradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Grading Settings</h2>
              <button onClick={() => setShowGradeModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Mid Exam Weight (%)</label>
                <input
                  type="number"
                  name="midWeight"
                  value={gradingSettings.midWeight * 100}
                  onChange={(e) => handleGradingChange({ target: { name: 'midWeight', value: e.target.value / 100 } })}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Quiz Weight (%)</label>
                <input
                  type="number"
                  name="quizWeight"
                  value={gradingSettings.quizWeight * 100}
                  onChange={(e) => handleGradingChange({ target: { name: 'quizWeight', value: e.target.value / 100 } })}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Assignment Weight (%)</label>
                <input
                  type="number"
                  name="assignmentWeight"
                  value={gradingSettings.assignmentWeight * 100}
                  onChange={(e) => handleGradingChange({ target: { name: 'assignmentWeight', value: e.target.value / 100 } })}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Final Exam Weight (%)</label>
                <input
                  type="number"
                  name="finalWeight"
                  value={gradingSettings.finalWeight * 100}
                  onChange={(e) => handleGradingChange({ target: { name: 'finalWeight', value: e.target.value / 100 } })}
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                />
              </div>
              
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-center">
                  Total: <strong>{((gradingSettings.midWeight + gradingSettings.quizWeight + 
                    gradingSettings.assignmentWeight + gradingSettings.finalWeight) * 100).toFixed(0)}%</strong>
                </p>
                {Math.abs(gradingSettings.midWeight + gradingSettings.quizWeight + 
                  gradingSettings.assignmentWeight + gradingSettings.finalWeight - 1) > 0.01 && (
                  <p className="text-xs text-red-500 text-center mt-1">
                    Weights must add up to 100%
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowGradeModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600">Cancel</button>
              <button onClick={saveGradingSettings} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AcademicYearManagement;