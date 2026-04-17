import mongoose from "mongoose";
import Payment from "../models/Payment.model.js";
import Student from "../models/Student.model.js";
import PaymentSettings from "../models/PaymentSettings.model.js";
import dotenv from 'dotenv';

dotenv.config();

async function generatePaymentsForAllStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_management');
    console.log("Connected to MongoDB");
    
    const currentYear = new Date().getFullYear();
    const ethiopianYear = currentYear - 8;
    const academicYear = `${ethiopianYear} EC - ${ethiopianYear + 1} EC`;
    
    // Get payment settings
    let settings = await PaymentSettings.findOne({ academicYear });
    if (!settings) {
      settings = new PaymentSettings({
        monthlyFee: 4000,
        lateFeePerDay: 5,
        maxLateFeePercent: 30,
        gracePeriodDays: 10,
        earlyPaymentDiscount: 5,
        siblingDiscount: 10,
        meritDiscount: 15,
        dueDayOfMonth: 1,
        suspensionAfterMonths: 5,
        academicYear: academicYear,
        isActive: true
      });
      await settings.save();
      console.log("Created payment settings");
    }
    
    // Get all students
    const students = await Student.find();
    console.log(`Found ${students.length} students`);
    
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    
    let created = 0;
    let skipped = 0;
    
    for (const student of students) {
      // Generate payments for all months up to current month
      for (let i = 0; i <= currentMonthIndex; i++) {
        const month = months[i];
        const monthIndex = i;
        const year = currentYear;
        
        // Check if payment already exists
        const existingPayment = await Payment.findOne({
          student: student._id,
          academicYear,
          month: `${month} ${year}`,
          monthIndex: monthIndex
        });
        
        if (existingPayment) {
          skipped++;
          continue;
        }
        
        // Calculate due date
        const dueDate = new Date(year, monthIndex, settings.dueDayOfMonth);
        
        // Calculate sibling discount
        let discountAmount = 0;
        let discountType = "none";
        
        if (student.parent) {
          const siblings = await Student.find({ parent: student.parent });
          if (siblings.length > 1) {
            discountAmount = (settings.monthlyFee * settings.siblingDiscount) / 100;
            discountType = "sibling";
          }
        }
        
        const amountDue = settings.monthlyFee - discountAmount;
        
        const payment = new Payment({
          student: student._id,
          academicYear,
          month: `${month} ${year}`,
          monthIndex: monthIndex,
          year: year,
          amountDue: amountDue,
          amountPaid: 0,
          discountAmount: discountAmount,
          discountType: discountType,
          lateFee: 0,
          totalAmount: amountDue,
          dueDate: dueDate,
          status: "pending",
          paymentMethod: "manual"
        });
        
        await payment.save();
        created++;
        console.log(`Created payment for ${student.fullName} - ${month} ${year}`);
      }
    }
    
    console.log("\n=================================");
    console.log("Generation Complete!");
    console.log(`✅ Created: ${created} payments`);
    console.log(`⚠️ Skipped: ${skipped} payments`);
    console.log("=================================");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

generatePaymentsForAllStudents();