import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={48} className="text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment could not be processed. Please try again or contact support.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Try Again
          </button>
          <button
            onClick={() => navigate('/student/payments')}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            <Home size={16} className="inline mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;