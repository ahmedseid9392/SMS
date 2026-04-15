import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  Save,
  FileText,
  Settings,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminPayments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [settings, setSettings] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    section: "",
    status: "",
    search: ""
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [waiveLateFee, setWaiveLateFee] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    monthlyFee: 4000,
    lateFeePerDay: 5,
    maxLateFeePercent: 30,
    gracePeriodDays: 10,
    earlyPaymentDiscount: 5,
    siblingDiscount: 10,
    meritDiscount: 15,
    dueDayOfMonth: 1,
    suspensionAfterMonths: 5
  });
  const [reportType, setReportType] = useState("monthly_collection");
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchAcademicYears();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchStudents();
    }
  }, [selectedYear, filters]);

  const fetchAcademicYears = async () => {
    try {
      const response = await api.get('/payments/academic-years');
      const years = response.data.data || [];
      setAcademicYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
      toast.error("Failed to load academic years");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/payment-settings');
      const data = response.data.data;
      setSettings(data);
      setSettingsForm({
        monthlyFee: data.monthlyFee || 4000,
        lateFeePerDay: data.lateFeePerDay || 5,
        maxLateFeePercent: data.maxLateFeePercent || 30,
        gracePeriodDays: data.gracePeriodDays || 10,
        earlyPaymentDiscount: data.earlyPaymentDiscount || 5,
        siblingDiscount: data.siblingDiscount || 10,
        meritDiscount: data.meritDiscount || 15,
        dueDayOfMonth: data.dueDayOfMonth || 1,
        suspensionAfterMonths: data.suspensionAfterMonths || 5
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load payment settings");
    }
  };

 const fetchStudents = async () => {
  setLoading(true);
  try {
    const response = await api.get('/payments/all', {
      params: {
        academicYear: selectedYear,
        grade: filters.grade,
        section: filters.section,
        search: filters.search
      }
    });
    
    const studentsData = response.data.data || [];
    
    // Log to debug payment data
    console.log("Fetched students:", studentsData);
    if (studentsData.length > 0) {
      console.log("First student payments:", studentsData[0].payments);
    }
    
    setStudents(studentsData);
  } catch (error) {
    console.error("Error fetching students:", error);
    toast.error("Failed to load student payments");
  } finally {
    setLoading(false);
  }
};

  const updateSettings = async () => {
    try {
      const response = await api.put('/payment-settings', {
        ...settingsForm,
        academicYear: selectedYear
      });
      if (response.data.success) {
        setSettings(response.data.data);
        toast.success("Payment settings updated!");
        setShowSettingsModal(false);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    }
  };

  const recordManualPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedStudent) {
      toast.error("No student selected");
      return;
    }

    if (!selectedPaymentMonth) {
      toast.error("Please select a payment month");
      return;
    }

    try {
      const response = await api.post('/payments/manual', {
        studentId: selectedStudent.student._id,
        academicYear: selectedYear,
        month: selectedPaymentMonth,
        amount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod,
        remarks: paymentRemarks,
        waiveLateFee: waiveLateFee
      });
      
      if (response.data.success) {
        toast.success("Payment recorded successfully!");
        setShowPaymentModal(false);
        setPaymentAmount("");
        setPaymentRemarks("");
        setWaiveLateFee(false);
        setSelectedPaymentMonth("");
        fetchStudents();
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  const generatePayments = async () => {
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    
    try {
      await api.post('/payments/generate', {
        academicYear: selectedYear,
        month: currentMonth,
        year: currentYear
      });
      toast.success("Monthly payments generated!");
      fetchStudents();
    } catch (error) {
      console.error("Error generating payments:", error);
      toast.error("Failed to generate payments");
    }
  };

  const applyLateFees = async () => {
    try {
      await api.post('/payments/apply-fines');
      toast.success("Late fees applied!");
      fetchStudents();
    } catch (error) {
      console.error("Error applying late fees:", error);
      toast.error("Failed to apply late fees");
    }
  };

  const checkSuspensions = async () => {
    try {
      await api.post('/payments/check-suspension');
      toast.success("Suspension check completed!");
      fetchStudents();
    } catch (error) {
      console.error("Error checking suspensions:", error);
      toast.error("Failed to check suspensions");
    }
  };

  const generateReport = async () => {
    try {
      const response = await api.get('/payments/reports', {
        params: {
          academicYear: selectedYear,
          reportType: reportType,
          grade: filters.grade,
          section: filters.section
        }
      });
      setReportData(response.data.data);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    }
  };

  const exportToExcel = () => {
    if (!reportData) return;
    
    let csvContent = "";
    
    if (reportType === "monthly_collection") {
      csvContent = "Month,Expected Amount,Collected Amount,Discount,Late Fee,Transactions\n";
      reportData.forEach(row => {
        csvContent += `${row.month},${row.expected},${row.collected},${row.discount},${row.lateFee},${row.count}\n`;
      });
    } else if (reportType === "overdue") {
      csvContent = "Student Name,Grade,Section,Month,Amount Due,Late Fee,Total Due,Days Overdue\n";
      reportData.forEach(row => {
        csvContent += `${row.studentName},${row.grade},${row.section},${row.month},${row.amountDue},${row.lateFee},${row.totalDue},${row.daysOverdue}\n`;
      });
    } else if (reportType === "class_wise") {
      csvContent = "Grade,Total Students,Total Expected,Total Collected,Total Discount,Total Late Fee,Paid Count\n";
      reportData.forEach(row => {
        csvContent += `${row.grade},${row.totalStudents},${row.totalExpected},${row.totalCollected},${row.totalDiscount},${row.totalLateFee},${row.paidCount}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const totalCollected = students.reduce((sum, s) => sum + (s.summary?.totalPaid || 0), 0);
  const totalDue = students.reduce((sum, s) => sum + (s.summary?.totalDue || 0), 0);
  const totalLateFees = students.reduce((sum, s) => sum + (s.summary?.totalLateFee || 0), 0);
  const collectionRate = totalDue > 0 ? ((totalCollected / totalDue) * 100).toFixed(1) : 0;

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Payment Management
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage student payments, fees, and financial reports</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-xl"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
              style={{ color: "var(--text)" }}
            >
              <Settings size={18} className="inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Total Students</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{students.length}</p>
              </div>
              <Users size={28} className="text-blue-500 opacity-70" />
            </div>
          </div>
          
          <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
              </div>
              <DollarSign size={28} className="text-green-500 opacity-70" />
            </div>
          </div>
          
          <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Total Due</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
              </div>
              <CreditCard size={28} className="text-red-500 opacity-70" />
            </div>
          </div>
          
          <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Late Fees</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalLateFees)}</p>
              </div>
              <AlertCircle size={28} className="text-orange-500 opacity-70" />
            </div>
          </div>
          
          <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-70">Collection Rate</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{collectionRate}%</p>
              </div>
              <TrendingUp size={28} className="text-purple-500 opacity-70" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generatePayments}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Calendar size={18} className="inline mr-2" />
            Generate Monthly Payments
          </button>
          <button
            onClick={applyLateFees}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            <AlertCircle size={18} className="inline mr-2" />
            Apply Late Fees
          </button>
          <button
            onClick={checkSuspensions}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
          >
            <X size={18} className="inline mr-2" />
            Check Suspensions
          </button>
          <button
            onClick={fetchStudents}
            className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            <RefreshCw size={18} className="inline mr-2" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl shadow-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 rounded-xl"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
            <select
              value={filters.grade}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
              className="px-4 py-2 rounded-xl"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <option value="">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            <select
              value={filters.section}
              onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              className="px-4 py-2 rounded-xl"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 rounded-xl"
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <option value="monthly_collection">Monthly Collection</option>
              <option value="overdue">Overdue Payments</option>
              <option value="class_wise">Class-wise Report</option>
              <option value="fine_collected">Fine Collected</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={generateReport}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <FileText size={18} className="inline mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Students Payment Table */}
        <div className="rounded-2xl shadow-lg overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>Student Payment Status</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <th className="p-3 border text-left" style={{ color: "var(--text)" }}>Student</th>
                  <th className="p-3 border text-center" style={{ color: "var(--text)" }}>Grade</th>
                  <th className="p-3 border text-center" style={{ color: "var(--text)" }}>Section</th>
                  <th className="p-3 border text-right" style={{ color: "var(--text)" }}>Total Due</th>
                  <th className="p-3 border text-right" style={{ color: "var(--text)" }}>Total Paid</th>
                  <th className="p-3 border text-right" style={{ color: "var(--text)" }}>Late Fee</th>
                  <th className="p-3 border text-right" style={{ color: "var(--text)" }}>Balance</th>
                  <th className="p-3 border text-center" style={{ color: "var(--text)" }}>Status</th>
                  <th className="p-3 border text-center" style={{ color: "var(--text)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center p-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-8" style={{ color: "var(--text)" }}>No students found</td>
                  </tr>
                ) : (
                  students.map((item) => {
                    const student = item.student;
                    const summary = item.summary;
                    const isSuspended = summary?.isSuspended;
                    const balance = summary?.balance || 0;
                    const pendingPayments = item.payments?.filter(p => 
                      p.status === "pending" || p.status === "overdue" || p.status === "partial"
                    ) || [];
                    
                    return (
                      <tr key={student._id} className={`border-b ${isSuspended ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                        <td className="p-3">
                          <div>
                            <p className="font-medium" style={{ color: "var(--text)" }}>{student.fullName}</p>
                            <p className="text-xs opacity-60">{student.username}</p>
                          </div>
                        </td>
                        <td className="p-3 text-center" style={{ color: "var(--text)" }}>{student.grade}</td>
                        <td className="p-3 text-center" style={{ color: "var(--text)" }}>{student.section}</td>
                        <td className="p-3 text-right" style={{ color: "var(--text)" }}>{formatCurrency(summary?.totalDue || 0)}</td>
                        <td className="p-3 text-right text-green-600">{formatCurrency(summary?.totalPaid || 0)}</td>
                        <td className="p-3 text-right text-red-600">{formatCurrency(summary?.totalLateFee || 0)}</td>
                        <td className="p-3 text-right font-bold" style={{ color: "var(--text)" }}>{formatCurrency(balance)}</td>
                        <td className="p-3 text-center">
                          {isSuspended ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Suspended</span>
                          ) : balance <= 0 ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Good Standing</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Has Balance</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => {
                                setSelectedStudent(item);
                                setSelectedPaymentMonth(pendingPayments[0]?.month || "");
                                setPaymentAmount("");
                                setShowPaymentModal(true);
                              }}
                              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                              title="Record Payment"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent(item);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                              title="View Details"
                            >
                              <Eye size={16} />
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
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Payment Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Monthly Fee (Birr)</label>
                <input
                  type="number"
                  value={settingsForm.monthlyFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, monthlyFee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Late Fee Per Day (Birr)</label>
                <input
                  type="number"
                  value={settingsForm.lateFeePerDay}
                  onChange={(e) => setSettingsForm({ ...settingsForm, lateFeePerDay: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Max Late Fee (%)</label>
                <input
                  type="number"
                  value={settingsForm.maxLateFeePercent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxLateFeePercent: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Grace Period (days)</label>
                <input
                  type="number"
                  value={settingsForm.gracePeriodDays}
                  onChange={(e) => setSettingsForm({ ...settingsForm, gracePeriodDays: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Early Payment Discount (%)</label>
                <input
                  type="number"
                  value={settingsForm.earlyPaymentDiscount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, earlyPaymentDiscount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Sibling Discount (%)</label>
                <input
                  type="number"
                  value={settingsForm.siblingDiscount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siblingDiscount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Merit Discount (%)</label>
                <input
                  type="number"
                  value={settingsForm.meritDiscount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meritDiscount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Due Day of Month</label>
                <input
                  type="number"
                  value={settingsForm.dueDayOfMonth}
                  onChange={(e) => setSettingsForm({ ...settingsForm, dueDayOfMonth: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Suspension After (months)</label>
                <input
                  type="number"
                  value={settingsForm.suspensionAfterMonths}
                  onChange={(e) => setSettingsForm({ ...settingsForm, suspensionAfterMonths: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600">Cancel</button>
              <button onClick={updateSettings} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
{showPaymentModal && selectedStudent && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Record Payment</h2>
        <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm" style={{ color: "var(--text)" }}>Student</p>
          <p className="font-semibold" style={{ color: "var(--text)" }}>{selectedStudent.student.fullName}</p>
          <p className="text-xs opacity-60">Grade {selectedStudent.student.grade} - Section {selectedStudent.student.section}</p>
        </div>
        
        {/* Debug info - remove after testing */}
        <div className="text-xs text-gray-500">
          Payments found: {selectedStudent.payments?.length || 0}
        </div>
        
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Select Payment Month</label>
          <select
            value={selectedPaymentMonth}
            onChange={(e) => {
              setSelectedPaymentMonth(e.target.value);
              // Auto-fill the amount when month is selected
              const selectedPay = selectedStudent.payments?.find(p => p.month === e.target.value);
              if (selectedPay) {
                const totalDue = (selectedPay.amountDue || 0) + (selectedPay.lateFee || 0);
                setPaymentAmount(totalDue.toString());
              }
            }}
            className="w-full px-3 py-2 rounded-lg"
            style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            <option value="">Select month...</option>
            {selectedStudent.payments && selectedStudent.payments.length > 0 ? (
              selectedStudent.payments
                .filter(p => p.status === "pending" || p.status === "overdue" || p.status === "partial")
                .map((payment, idx) => {
                  const totalDue = (payment.amountDue || 0) + (payment.lateFee || 0);
                  return (
                    <option key={idx} value={payment.month}>
                      {payment.month} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(totalDue)} ({payment.status})
                    </option>
                  );
                })
            ) : (
              <option disabled>No pending payments found</option>
            )}
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Amount (Birr)</label>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg"
            style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            placeholder="Enter amount"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 rounded-lg"
            style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="chapa">Chapa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>Remarks (Optional)</label>
          <textarea
            value={paymentRemarks}
            onChange={(e) => setPaymentRemarks(e.target.value)}
            className="w-full px-3 py-2 rounded-lg"
            style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
            rows="2"
            placeholder="Additional notes..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={waiveLateFee}
            onChange={(e) => setWaiveLateFee(e.target.checked)}
            id="waiveLateFee"
            className="w-4 h-4"
          />
          <label htmlFor="waiveLateFee" className="text-sm" style={{ color: "var(--text)" }}>Waive late fee for this payment</label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600">Cancel</button>
        <button onClick={recordManualPayment} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Record Payment</button>
      </div>
    </div>
  </div>
)}

      {/* Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Payment Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold text-lg" style={{ color: "var(--text)" }}>{selectedStudent.student.fullName}</p>
              <p className="text-sm opacity-60">Grade {selectedStudent.student.grade} - Section {selectedStudent.student.section}</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2 text-left">Month</th>
                    <th className="p-2 text-right">Amount Due</th>
                    <th className="p-2 text-right">Late Fee</th>
                    <th className="p-2 text-right">Discount</th>
                    <th className="p-2 text-right">Paid</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.payments?.map((payment, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{payment.month}</td>
                      <td className="p-2 text-right">{formatCurrency(payment.amountDue)}</td>
                      <td className="p-2 text-right text-red-600">{formatCurrency(payment.lateFee)}</td>
                      <td className="p-2 text-right text-green-600">{formatCurrency(payment.discountAmount)}</td>
                      <td className="p-2 text-right">{formatCurrency(payment.amountPaid)}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === "paid" ? "bg-green-100 text-green-700" :
                          payment.status === "overdue" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-2 text-center">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPayments;