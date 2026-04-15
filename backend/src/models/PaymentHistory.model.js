// backend/src/models/PaymentHistory.model.js
import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  
  action: {
    type: String,
    enum: ["created", "updated", "paid", "fine_applied", "discount_applied", 
           "waived", "refunded", "manual_entry", "bulk_payment"],
    required: true
  },
  
  previousData: {
    type: mongoose.Schema.Types.Mixed
  },
  newData: {
    type: mongoose.Schema.Types.Mixed
  },
  
  amount: {
    type: Number
  },
  
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  
  remarks: {
    type: String
  }
}, { timestamps: true });

// Auto-delete after 7 years (for backup)
paymentHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 365 * 24 * 60 * 60 });

export default mongoose.model("PaymentHistory", paymentHistorySchema);