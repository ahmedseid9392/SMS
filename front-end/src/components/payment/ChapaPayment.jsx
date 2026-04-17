import React, { useState } from 'react';
import { CreditCard, Loader2, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ChapaPayment = ({ studentId, academicYear, month, amount, email: userEmail, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/payments/chapa/initialize', {
        studentId,
        academicYear,
        month,
        amount: Number(amount),
        email,
      });
      
      console.log("Payment response:", response.data);
      
      if (response.data.success) {
        setShowSuccess(true);
        toast.success(response.data.message || "Payment successful!");
        
        // Refresh after 2 seconds
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMsg = error.response?.data?.message || error.message;
      
      // Check if it's actually a success message from mock
      if (errorMsg.includes("successful") || errorMsg.includes("Test payment")) {
        setShowSuccess(true);
        toast.success("Payment successful!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        toast.error(errorMsg || "Failed to process payment");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(amount);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your payment of {formatCurrency(amount)} for {month} has been confirmed.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            <CreditCard size={24} className="inline mr-2 text-blue-500" />
            Make Payment
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You are about to pay <strong>{formatCurrency(amount)}</strong> for <strong>{month}</strong>
            </p>
          </div>
          
          <div>
            <label className="block text-sm mb-1" style={{ color: "var(--text)" }}>
              Email Address (for receipt)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 rounded-lg"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              required
            />
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              ℹ️ Demo Mode: This is a test payment. No actual charge will be made.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="inline animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Pay Now (Demo)'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapaPayment;