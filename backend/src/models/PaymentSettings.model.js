// backend/src/models/PaymentSettings.model.js
import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  // Fee settings
  monthlyFee: {
    type: Number,
    default: 4000,
    required: true
  },
  
  // Late fee settings
  lateFeePerDay: {
    type: Number,
    default: 5, // 5 Birr per day
    required: true
  },
  maxLateFeePercent: {
    type: Number,
    default: 30, // Max 30% of monthly fee
    required: true
  },
  gracePeriodDays: {
    type: Number,
    default: 10,
    required: true
  },
  
  // Discount settings
  discountPercent: {
    type: Number,
    default: 0,
    description: "Global discount percentage"
  },
  earlyPaymentDiscount: {
    type: Number,
    default: 5, // 5% discount for early payment
    required: true
  },
  siblingDiscount: {
    type: Number,
    default: 10, // 10% discount for second child
    required: true
  },
  meritDiscount: {
    type: Number,
    default: 15, // 15% discount for merit students
    required: true
  },
  
  // Payment rules
  dueDayOfMonth: {
    type: Number,
    default: 1,
    required: true
  },
  suspensionAfterMonths: {
    type: Number,
    default: 5,
    required: true
  },
  
  // Academic year
  academicYear: {
    type: String,
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("PaymentSettings", paymentSettingsSchema);