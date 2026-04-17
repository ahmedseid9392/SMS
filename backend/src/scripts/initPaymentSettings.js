// backend/src/scripts/initPaymentSettings.js
import mongoose from "mongoose";
import PaymentSettings from "../models/PaymentSettings.model.js";
import dotenv from 'dotenv';

dotenv.config();
const initPaymentSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const currentYear = new Date().getFullYear();
    const ethiopianYear = currentYear - 8;
    const academicYear = `${ethiopianYear} EC - ${ethiopianYear + 1} EC`;
    
    // Check if settings already exist
    const existingSettings = await PaymentSettings.findOne({ academicYear });
    
    if (!existingSettings) {
      const settings = new PaymentSettings({
        monthlyFee: 4000,
        lateFeePerDay: 5,
        maxLateFeePercent: 30,
        gracePeriodDays: 10,
        discountPercent: 0,
        earlyPaymentDiscount: 5,
        siblingDiscount: 10,
        meritDiscount: 15,
        dueDayOfMonth: 1,
        suspensionAfterMonths: 5,
        academicYear: academicYear,
        isActive: true
      });
      
      await settings.save();
      console.log("✅ Payment settings initialized:", academicYear);
    } else {
      console.log("⚠️ Payment settings already exist");
    }
    
    await mongoose.disconnect();
    console.log("✅ Setup complete");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

initPaymentSettings();