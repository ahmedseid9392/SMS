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
  
  month: {
    type: String,
    required: true
  },
  monthIndex: {
    type: Number,
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
  
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ["chapa", "cash", "bank", "manual", "mock"], // Added 'mock' here
    default: "manual"
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  fineDays: {
    type: Number,
    default: 0
  },
  fineAppliedAt: {
    type: Date
  },
  
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
  
  isBulkPayment: {
    type: Boolean,
    default: false
  },
  bulkMonths: [{
    month: String,
    monthIndex: Number
  }],
  
  remarks: {
    type: String
  }
}, { timestamps: true });

paymentSchema.index({ student: 1, academicYear: 1, monthIndex: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ transactionId: 1 });

export default mongoose.model("Payment", paymentSchema);