import axios from 'axios';
import crypto from 'crypto';
import CHAPA_CONFIG from '../config/chapa.config.js';
import Payment from '../models/Payment.model.js';
import Student from '../models/Student.model.js';
import { createNotification } from './notificationController.js';

// Initialize Chapa payment
export const initializePayment = async (req, res) => {
  try {
    const { studentId, academicYear, month, amount, paymentMethod, email } = req.body;
    
    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Generate unique transaction reference
    const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Prepare payment data for Chapa
    const paymentData = {
      amount: amount,
      currency: CHAPA_CONFIG.currency,
      email: email || student.email || 'student@school.com',
      first_name: student.fullName.split(' ')[0] || student.fullName,
      last_name: student.fullName.split(' ').slice(1).join(' ') || 'Student',
      tx_ref: tx_ref,
      callback_url: CHAPA_CONFIG.successUrl,
      return_url: CHAPA_CONFIG.successUrl,
      customization: {
        title: 'Green Valley School Fee Payment',
        description: `Payment for ${month} - ${academicYear}`
      },
      meta: {
        studentId: studentId,
        academicYear: academicYear,
        month: month,
        paymentType: 'monthly_fee'
      }
    };
    
    console.log("Initializing Chapa payment:", paymentData);
    
    // Make request to Chapa API
    const response = await axios.post(
      `${CHAPA_CONFIG.baseURL}/transaction/initialize`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${CHAPA_CONFIG.secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.status === 'success') {
      // Store transaction reference temporarily
      await Payment.findOneAndUpdate(
        { student: studentId, academicYear, month },
        { 
          $set: { 
            transactionId: tx_ref,
            paymentMethod: 'chapa',
            status: 'pending'
          } 
        },
        { upsert: true }
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
    console.error("Chapa payment initialization error:", error);
    res.status(500).json({ 
      message: "Failed to initialize payment", 
      error: error.response?.data?.message || error.message 
    });
  }
};

// Verify payment (called after user returns from Chapa)
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    if (!tx_ref) {
      return res.status(400).json({ message: "Transaction reference required" });
    }
    
    // Verify payment with Chapa
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
      
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { transactionId: tx_ref },
        {
          $set: {
            amountPaid: paymentData.amount,
            status: 'paid',
            paidDate: new Date(),
            paymentMethod: 'chapa',
            receiptNumber: `CHP-${paymentData.tx_ref}`
          }
        },
        { new: true }
      ).populate('student');
      
      if (payment) {
        // Send notification to student
        await createNotification(
          payment.student._id,
          "STUDENT",
          "Payment Successful",
          `Your payment of ${paymentData.amount} ETB for ${payment.month} has been confirmed. Receipt: ${payment.receiptNumber}`,
          "SUCCESS",
          { paymentId: payment._id, amount: paymentData.amount, month: payment.month }
        );
        
        // Send notification to parent if exists
        if (payment.student.parent) {
          await createNotification(
            payment.student.parent,
            "PARENT",
            "Payment Successful",
            `Payment of ${paymentData.amount} ETB for ${payment.student.fullName} (${payment.month}) has been confirmed.`,
            "SUCCESS",
            { studentName: payment.student.fullName, amount: paymentData.amount }
          );
        }
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

// Chapa Webhook (for asynchronous payment confirmation)
export const chapaWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-chapa-signature'];
    const payload = req.body;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', CHAPA_CONFIG.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    const { tx_ref, status, amount, meta } = payload;
    
    if (status === 'success') {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { transactionId: tx_ref },
        {
          $set: {
            amountPaid: amount,
            status: 'paid',
            paidDate: new Date(),
            paymentMethod: 'chapa'
          }
        },
        { new: true }
      ).populate('student');
      
      if (payment) {
        // Send notification
        await createNotification(
          payment.student._id,
          "STUDENT",
          "Payment Confirmed",
          `Your payment of ${amount} ETB for ${payment.month} has been confirmed.`,
          "SUCCESS",
          { paymentId: payment._id, amount }
        );
      }
    }
    
    res.status(200).json({ message: 'Webhook received' });
    
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: 'Webhook processing failed' });
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