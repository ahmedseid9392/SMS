// backend/src/models/StudentPaymentSummary.model.js
import mongoose from "mongoose";

const studentPaymentSummarySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true
  },
  academicYear: {
    type: String,
    required: true
  },
  
  totalDue: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalLateFee: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  
  lastPaymentDate: {
    type: Date
  },
  lastPaymentAmount: {
    type: Number
  },
  
  monthsOverdue: {
    type: Number,
    default: 0
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspendedAt: {
    type: Date
  },
  suspensionReason: {
    type: String
  },
  
  // Payment status for each month (cached for quick access)
  monthlyStatus: [{
    month: String,
    monthIndex: Number,
    status: String,
    amountPaid: Number
  }]
}, { timestamps: true });

export default mongoose.model("StudentPaymentSummary", studentPaymentSummarySchema);