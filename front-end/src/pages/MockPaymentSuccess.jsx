import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import api from '../api/axios';

const MockPaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    if (tx_ref) {
      // Verify the mock payment
      const verifyPayment = async () => {
        try {
          await api.get(`/payments/mock/verify?tx_ref=${tx_ref}`);
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      };
      verifyPayment();
    }
  }, [tx_ref]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-2">Test Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your test payment has been processed successfully. This is a mock payment for testing purposes.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ This was a test payment. No actual money was charged.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/student/payments')}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Home size={16} className="inline mr-2" />
          Back to Payments
        </button>
      </div>
    </div>
  );
};

export default MockPaymentSuccess;