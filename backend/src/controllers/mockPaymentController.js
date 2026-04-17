import Payment from '../models/Payment.model.js';
import Student from '../models/Student.model.js';
import StudentPaymentSummary from '../models/StudentPaymentSummary.model.js';
import PaymentSettings from '../models/PaymentSettings.model.js';
import { createNotification } from './notificationController.js';

// Initialize mock payment
export const initializeMockPayment = async (req, res) => {
  try {
    const { studentId, academicYear, month, amount, email } = req.body;
    
    console.log("Mock payment initiated:", { studentId, academicYear, month, amount, email });
    
    // Validate required fields
    if (!studentId || !academicYear || !month) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: studentId, academicYear, month" 
      });
    }
    
    // Generate fake transaction reference
    const tx_ref = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Find and update or create payment record
    const payment = await Payment.findOneAndUpdate(
      { student: studentId, academicYear, month: month },
      { 
        $set: { 
          transactionId: tx_ref,
          status: 'pending'
        } 
      },
      { upsert: true, new: true }
    );
    
    console.log("Payment record created/updated:", payment._id);
    
    res.json({
      success: true,
      tx_ref: tx_ref,
      message: "Payment initialized successfully"
    });
    
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to initialize payment", 
      error: error.message 
    });
  }
};

// Verify mock payment
export const verifyMockPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    
    console.log("Verifying mock payment:", tx_ref);
    
    if (!tx_ref) {
      return res.status(400).json({ 
        success: false, 
        message: "Transaction reference required" 
      });
    }
    
    // Find the payment record
    const payment = await Payment.findOne({ transactionId: tx_ref }).populate('student');
    
    if (!payment) {
      console.log("Payment not found for tx_ref:", tx_ref);
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }
    
    console.log("Found payment:", {
      id: payment._id,
      student: payment.student?.fullName,
      month: payment.month,
      status: payment.status
    });
    
    // Calculate total amount
    const totalAmount = (payment.amountDue || 0) + (payment.lateFee || 0);
    
    // Update payment record as paid (don't set paymentMethod to avoid enum error)
    payment.amountPaid = totalAmount;
    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.receiptNumber = `MOCK-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await payment.save();
    
    console.log("Payment updated to paid status");
    
    // Update student summary
    if (payment.student) {
      await updateStudentSummary(payment.student._id, payment.academicYear);
    }
    
    // Send notification to student
    if (payment.student) {
      await createNotification(
        payment.student._id,
        "STUDENT",
        "Payment Successful (Test)",
        `Your test payment of ${totalAmount} ETB for ${payment.month} has been confirmed. Receipt: ${payment.receiptNumber}`,
        "SUCCESS",
        { paymentId: payment._id, amount: totalAmount, month: payment.month }
      );
    }
    
    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        month: payment.month,
        amount: totalAmount,
        receiptNumber: payment.receiptNumber,
        status: payment.status
      }
    });
    
  } catch (error) {
    console.error("Mock payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to verify payment", 
      error: error.message 
    });
  }
};

// Helper function to update student summary
const updateStudentSummary = async (studentId, academicYear) => {
  try {
    const payments = await Payment.find({
      student: studentId,
      academicYear: academicYear
    });
    
    const totalDue = payments.reduce((sum, p) => sum + (p.amountDue || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalLateFee = payments.reduce((sum, p) => sum + (p.lateFee || 0), 0);
    const totalDiscount = payments.reduce((sum, p) => sum + (p.discountAmount || 0), 0);
    const balance = totalDue + totalLateFee - totalPaid - totalDiscount;
    const monthsOverdue = payments.filter(p => p.status === "overdue").length;
    
    let summary = await StudentPaymentSummary.findOne({
      student: studentId,
      academicYear: academicYear
    });
    
    if (!summary) {
      summary = new StudentPaymentSummary({
        student: studentId,
        academicYear: academicYear
      });
    }
    
    summary.totalDue = totalDue;
    summary.totalPaid = totalPaid;
    summary.totalLateFee = totalLateFee;
    summary.totalDiscount = totalDiscount;
    summary.balance = balance;
    summary.monthsOverdue = monthsOverdue;
    
    // Check if should be suspended
    const settings = await PaymentSettings.findOne({ academicYear });
    if (settings && monthsOverdue >= settings.suspensionAfterMonths) {
      summary.isSuspended = true;
      summary.suspendedAt = new Date();
      summary.suspensionReason = `Payment overdue for ${monthsOverdue} months`;
    } else {
      summary.isSuspended = false;
    }
    
    await summary.save();
    console.log("Student summary updated for:", studentId);
    
  } catch (error) {
    console.error("Update student summary error:", error);
  }
};