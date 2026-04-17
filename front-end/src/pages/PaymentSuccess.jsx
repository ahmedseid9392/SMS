import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import api from '../api/axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tx_ref) {
      fetchPaymentStatus();
    }
  }, [tx_ref]);

  const fetchPaymentStatus = async () => {
    try {
      const response = await api.get(`/payments/chapa/status/${tx_ref}`);
      setPayment(response.data);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your payment has been processed successfully.
        </p>
        
        {payment && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm"><strong>Amount:</strong> {payment.amount} ETB</p>
            <p className="text-sm"><strong>Month:</strong> {payment.month}</p>
            <p className="text-sm"><strong>Receipt:</strong> {payment.receiptNumber}</p>
            <p className="text-sm"><strong>Status:</strong> <span className="text-green-600">Paid</span></p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/student/payments')}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Home size={16} className="inline mr-2" />
            My Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;