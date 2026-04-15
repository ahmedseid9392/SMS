// backend/src/models/Payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  
  academicYear: {
    type: String,
    required: true
  },
  
  // Payment details
  month: {
    type: String, // e.g., "January 2024"
    required: true
  },
  monthIndex: {
    type: Number, // 0-11 for sorting
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  
  amountDue: {
    type: Number,
    required: true,
    default: 4000
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  lateFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  
  status: {
    type: String,
    enum: ["pending", "paid", "overdue", "partial", "waived"],
    default: "pending"
  },
  
  // Payment transaction
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ["chapa", "cash", "bank", "manual"],
    default: "manual"
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Fine tracking
  fineDays: {
    type: Number,
    default: 0
  },
  fineAppliedAt: {
    type: Date
  },
  
  // Discount tracking
  discountType: {
    type: String,
    enum: ["none", "early_payment", "sibling", "merit", "manual", "bulk"],
    default: "none"
  },
  discountReason: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  // Payment for multiple months
  isBulkPayment: {
    type: Boolean,
    default: false
  },
  bulkMonths: [{
    month: String,
    monthIndex: Number
  }],
  
  // Remarks
  remarks: {
    type: String
  }
}, { timestamps: true });

// Indexes for faster queries
paymentSchema.index({ student: 1, academicYear: 1, monthIndex: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ transactionId: 1 });

export default mongoose.model("Payment", paymentSchema);