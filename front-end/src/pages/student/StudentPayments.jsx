import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { 
  CreditCard, 
  Download, 
  Eye, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Printer
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ChapaPayment from "../../components/payment/ChapaPayment";

const StudentPayments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [showChapaModal, setShowChapaModal] = useState(false);
const [selectedPaymentForChapa, setSelectedPaymentForChapa] = useState(null);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchPayments();
    }
  }, [selectedYear]);

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

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/payments/student/${user?.id}`, {
        params: { academicYear: selectedYear }
      });
      setPayments(response.data.data?.payments || []);
      setSummary(response.data.data?.summary || null);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (payment) => {
    try {
      const response = await api.get(`/payments/receipt/${payment._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${payment.receiptNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Receipt downloaded!");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle, text: "Paid" };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-700", icon: Clock, text: "Pending" };
      case "overdue":
        return { color: "bg-red-100 text-red-700", icon: AlertCircle, text: "Overdue" };
      case "partial":
        return { color: "bg-blue-100 text-blue-700", icon: TrendingUp, text: "Partial" };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: Clock, text: status };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg opacity-70">Loading payment history...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Payment History
            </h1>
            <p className="text-sm opacity-70 mt-1">Track your monthly payments and receipts</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-xl border"
              style={{ background: "var(--bg)", borderColor: "var(--border)" }}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl shadow-lg p-6"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Due</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalDue)}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20">
                  <CreditCard size={24} className="text-red-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow-lg p-6"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow-lg p-6"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Balance</p>
                  <p className={`text-2xl font-bold ${summary.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatCurrency(Math.abs(summary.balance))}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/20">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow-lg p-6"
                 style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Late Fees</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalLateFee)}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspension Warning */}
        {summary?.isSuspended && (
          <div className="rounded-2xl p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-red-600" />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300">Account Suspended</h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Your account has been suspended due to overdue payments. Please contact the administration office.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="rounded-2xl shadow-lg overflow-hidden"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          
          <div className="p-6 border-b flex gap-20" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} />
              Monthly Payment Details
            </h2>
                                    <button
  onClick={() => {
    setSelectedPaymentForChapa(payments);
    setShowChapaModal(true);
  }}
  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
  title="Pay Online"
>
  <CreditCard size={16} />
</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <th className="p-3 border text-left">Month</th>
                  <th className="p-3 border text-center">Due Date</th>
                  <th className="p-3 border text-center">Amount Due</th>
                  <th className="p-3 border text-center">Late Fee</th>
                  <th className="p-3 border text-center">Discount</th>
                  <th className="p-3 border text-center">Paid Amount</th>
                  <th className="p-3 border text-center">Status</th>
                  <th className="p-3 border text-center">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard size={48} className="opacity-30" />
                        <p className="text-gray-500">No payment records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => {
                    const statusBadge = getStatusBadge(payment.status);
                    const StatusIcon = statusBadge.icon;
                    const isOverdue = payment.status === "overdue";
                    
                    return (
                      <tr key={payment._id} className={`border-b ${isOverdue ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                        <td className="p-3 font-medium">{payment.month}</td>
                        <td className="p-3 text-center">{formatDate(payment.dueDate)}</td>
                        <td className="p-3 text-center">{formatCurrency(payment.amountDue)}</td>
                        <td className="p-3 text-center text-red-600">
                          {payment.lateFee > 0 ? formatCurrency(payment.lateFee) : "-"}
                        </td>
                        <td className="p-3 text-center text-green-600">
                          {payment.discountAmount > 0 ? formatCurrency(payment.discountAmount) : "-"}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          {payment.amountPaid > 0 ? formatCurrency(payment.amountPaid) : "-"}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                            <StatusIcon size={12} />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {payment.status === "paid" && payment.receiptNumber && (
                            <button
                              onClick={() => downloadReceipt(payment)}
                              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                              title="Download Receipt"
                            >
                              <Download size={16} />
                            </button>
                          )}
  
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-center opacity-60">
              Late fee of 5 Birr per day applies after 10-day grace period. Maximum late fee is 30% of monthly fee.
            </p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="rounded-2xl shadow-lg p-6"
             style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText size={18} />
            Payment Instructions
          </h3>
          <ul className="space-y-2 text-sm opacity-70">
            <li>• Monthly fee is due on the 1st of each month</li>
            <li>• 10-day grace period (until 10th of the month)</li>
            <li>• Late fee of 5 Birr per day applies after grace period</li>
            <li>• Maximum late fee is 30% of monthly fee</li>
            <li>• Account will be suspended after 5 months of overdue payments</li>
            <li>• For payment inquiries, contact the finance office</li>
          </ul>
        </div>

          {/* Chapa modal  */}
{showChapaModal && selectedPaymentForChapa && (
  <ChapaPayment
    studentId={user?.id}
    academicYear={selectedYear}
    month={selectedPaymentForChapa.month}
    amount={selectedPaymentForChapa.amountDue + selectedPaymentForChapa.lateFee}
    onSuccess={() => {
      setShowChapaModal(false);
      fetchPayments();
    }}
    onCancel={() => setShowChapaModal(false)}
  />
)}
      </div>
    </Layout>
  );
};

export default StudentPayments;