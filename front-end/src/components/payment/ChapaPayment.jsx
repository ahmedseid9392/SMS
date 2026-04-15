import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ChapaPayment = ({ studentId, academicYear, month, amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(true);

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
        amount,
        email,
        paymentMethod: 'chapa'
      });
      
      if (response.data.success && response.data.checkout_url) {
        // Redirect to Chapa payment page
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment");
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB'
    }).format(amount);
  };

  if (!showForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            <CreditCard size={24} className="inline mr-2 text-blue-500" />
            Pay with Chapa
          </h2>
          <button 
            onClick={() => {
              setShowForm(false);
              if (onCancel) onCancel();
            }} 
            className="p-1 hover:bg-gray-100 rounded"
          >
            ✕
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
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                if (onCancel) onCancel();
              }}
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
                'Pay Now'
              )}
            </button>
          </div>
          
          <p className="text-xs text-center opacity-60">
            Secure payment powered by Chapa. Your information is encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapaPayment;