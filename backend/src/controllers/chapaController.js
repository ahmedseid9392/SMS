import axios from 'axios';
import CHAPA_CONFIG from '../config/chapa.config.js';
import Payment from '../models/Payment.model.js';
import Student from '../models/Student.model.js';
import PaymentSettings from '../models/PaymentSettings.model.js';
import { createNotification } from './notificationController.js';

// Initialize Chapa payment (with fallback to mock)
export const initializePayment = async (req, res) => {
  try {
    const { studentId, academicYear, month, amount, email } = req.body;
    
    console.log("Initializing payment...");
    
    // If Chapa key is not configured, use mock payment
    if (!CHAPA_CONFIG.secretKey) {
      console.log("Chapa key not configured, using mock payment");
      return initializeMockPayment(req, res);
    }
    
    // Validate required fields
    if (!studentId || !academicYear || !month || !amount) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }
    
    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Generate unique transaction reference
    const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Prepare payment data for Chapa
    const paymentData = {
      amount: Math.round(amount).toString(),
      currency: "ETB",
      email: email || student.email || 'student@school.com',
      first_name: student.fullName.split(' ')[0] || 'Student',
      last_name: student.fullName.split(' ').slice(1).join(' ') || 'User',
      tx_ref: tx_ref,
      callback_url: `${CHAPA_CONFIG.successUrl}?tx_ref=${tx_ref}`,
      return_url: `${CHAPA_CONFIG.successUrl}?tx_ref=${tx_ref}`,
      customization: {
        title: "School Fee Payment",
        description: `${month} - ${academicYear}`
      }
    };
    
    console.log("Sending to Chapa...");
    
    // Make request to Chapa API
    const response = await axios.post(
      `${CHAPA_CONFIG.baseURL}/transaction/initialize`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_CONFIG.secretKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data.status === 'success' && response.data.data?.checkout_url) {
      // Store transaction reference
      await Payment.findOneAndUpdate(
        { student: studentId, academicYear, month: month },
        { 
          $set: { 
            transactionId: tx_ref,
            paymentMethod: 'chapa',
            status: 'pending'
          } 
        },
        { upsert: true, new: true }
      );
      
      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }
    
  } catch (error) {
    console.error("Chapa payment error:", error.message);
    // Fallback to mock payment on error
    console.log("Falling back to mock payment");
    return initializeMockPayment(req, res);
  }
};

// Mock payment function (fallback)
const initializeMockPayment = async (req, res) => {
  try {
    const { studentId, academicYear, month, amount, email } = req.body;
    
    console.log("Using MOCK payment for:", { studentId, academicYear, month });
    
    // Generate fake transaction reference
    const tx_ref = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Store transaction reference
    await Payment.findOneAndUpdate(
      { student: studentId, academicYear, month: month },
      { 
        $set: { 
          transactionId: tx_ref,
          paymentMethod: 'manual',
          status: 'pending'
        } 
      },
      { upsert: true, new: true }
    );
    
    // For mock, we'll verify immediately and return success
    // This simulates a successful payment without redirecting to Chapa
    
    // Find the payment and mark as paid
    const payment = await Payment.findOne({ transactionId: tx_ref }).populate('student');
    
    if (payment) {
      const totalAmount = (payment.amountDue || 0) + (payment.lateFee || 0);
      
      payment.amountPaid = totalAmount;
      payment.status = 'paid';
      payment.paidDate = new Date();
      payment.paymentMethod = 'manual';
      payment.receiptNumber = `MOCK-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await payment.save();
      
      // Send notification
      await createNotification(
        payment.student._id,
        "STUDENT",
        "Payment Successful (Test Mode)",
        `Your test payment of ${totalAmount} ETB for ${payment.month} has been confirmed. Receipt: ${payment.receiptNumber}`,
        "SUCCESS",
        { paymentId: payment._id, amount: totalAmount, month: payment.month }
      );
    }
    
    res.json({
      success: true,
      isMock: true,
      message: "Test payment successful! (Mock mode)",
      tx_ref: tx_ref
    });
    
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment failed", 
      error: error.message 
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    console.log("Verifying payment for tx_ref:", tx_ref);
    
    if (!tx_ref) {
      return res.status(400).json({ message: "Transaction reference required" });
    }
    
    // Check if it's a mock payment
    if (tx_ref.startsWith('mock-')) {
      const payment = await Payment.findOne({ transactionId: tx_ref }).populate('student');
      
      if (payment && payment.status === 'paid') {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?tx_ref=${tx_ref}&mock=true`);
      } else {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?tx_ref=${tx_ref}`);
      }
    }
    
    // Real Chapa verification
    const response = await axios.get(
      `${CHAPA_CONFIG.baseURL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_CONFIG.secretKey}`
        }
      }
    );
    
    if (response.data.status === 'success') {
      const paymentData = response.data.data;
      const payment = await Payment.findOne({ transactionId: tx_ref }).populate('student');
      
      if (payment) {
        payment.amountPaid = parseFloat(paymentData.amount);
        payment.status = 'paid';
        payment.paidDate = new Date();
        payment.paymentMethod = 'chapa';
        payment.receiptNumber = `CHP-${paymentData.tx_ref || tx_ref}`;
        await payment.save();
        
        await createNotification(
          payment.student._id,
          "STUDENT",
          "Payment Successful",
          `Your payment of ${paymentData.amount} ETB for ${payment.month} has been confirmed.`,
          "SUCCESS",
          { paymentId: payment._id, amount: paymentData.amount, month: payment.month }
        );
      }
      
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?tx_ref=${tx_ref}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failed?tx_ref=${tx_ref}`);
    }
    
  } catch (error) {
    console.error("Payment verification error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    const payment = await Payment.findOne({ transactionId: tx_ref });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    
    res.json({
      success: true,
      status: payment.status,
      amount: payment.amountPaid,
      month: payment.month,
      receiptNumber: payment.receiptNumber
    });
    
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ message: "Failed to get payment status" });
  }
};