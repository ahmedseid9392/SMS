import mongoose from "mongoose";
import Payment from "../models/Payment.model.js";
import PaymentSettings from "../models/PaymentSettings.model.js";
import PaymentHistory from "../models/PaymentHistory.model.js";
import StudentPaymentSummary from "../models/StudentPaymentSummary.model.js";
import Student from "../models/Student.model.js";
import { createNotification } from "./notificationController.js";

const resolveAccessibleStudent = async (requestUser, studentId) => {
  if (!studentId) return null;

  if (requestUser.role === "PARENT") {
    return await Student.findOne({ _id: studentId, parent: requestUser.id });
  }

  if (requestUser.role === "STUDENT") {
    return requestUser.id.toString() === studentId.toString()
      ? await Student.findById(studentId)
      : null;
  }

  return await Student.findById(studentId);
};

// ==================== PAYMENT SETTINGS ====================

// Get current payment settings
export const getPaymentSettings = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const ethiopianYear = currentYear - 8;
    const academicYear = `${ethiopianYear} EC - ${ethiopianYear + 1} EC`;
    
    let settings = await PaymentSettings.findOne({ academicYear });
    
    if (!settings) {
      // Create default settings
      settings = new PaymentSettings({
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
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get payment settings error:", error);
    res.status(500).json({ message: "Failed to fetch payment settings" });
  }
};

// Update payment settings
export const updatePaymentSettings = async (req, res) => {
  try {
    const { academicYear, ...updateData } = req.body;
    
    console.log("Updating payment settings for:", academicYear);
    console.log("Update data:", updateData);
    
    // Find existing settings or create new
    let settings = await PaymentSettings.findOne({ academicYear });
    
    if (!settings) {
      settings = new PaymentSettings({ academicYear });
    }
    
    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        settings[key] = updateData[key];
      }
    });
    
    await settings.save();
    
    res.json({ 
      success: true, 
      data: settings, 
      message: "Settings updated successfully" 
    });
  } catch (error) {
    console.error("Update payment settings error:", error);
    res.status(500).json({ 
      message: "Failed to update settings", 
      error: error.message 
    });
  }
};
// ==================== GENERATE MONTHLY PAYMENTS ====================

// Generate monthly payments for all students
export const generateMonthlyPayments = async (req, res) => {
  try {
    const { academicYear, month, year } = req.body;
    const settings = await PaymentSettings.findOne({ academicYear });
    
    if (!settings) {
      return res.status(400).json({ message: "Payment settings not found" });
    }
    
    // Get all active students
    const students = await Student.find({ isActive: true });
    
    let created = 0;
    let skipped = 0;
    
    for (const student of students) {
      // Check if payment already exists for this month
      const existingPayment = await Payment.findOne({
        student: student._id,
        academicYear,
        month: `${month} ${year}`,
        monthIndex: getMonthIndex(month)
      });
      
      if (existingPayment) {
        skipped++;
        continue;
      }
      
      // Calculate due date
      const dueDate = new Date(year, getMonthNumber(month), settings.dueDayOfMonth);
      
      // Calculate amount with sibling discount
      const siblingCount = await getSiblingCount(student.parent);
      let discountAmount = 0;
      
      if (siblingCount > 1) {
        discountAmount = (settings.monthlyFee * settings.siblingDiscount) / 100;
      }
      
      const amountDue = settings.monthlyFee - discountAmount;
      
      const payment = new Payment({
        student: student._id,
        academicYear,
        month: `${month} ${year}`,
        monthIndex: getMonthIndex(month),
        year: year,
        amountDue: amountDue,
        amountPaid: 0,
        discountAmount: discountAmount,
        lateFee: 0,
        totalAmount: amountDue,
        dueDate: dueDate,
        status: "pending",
        paymentMethod: "manual",
        discountType: siblingCount > 1 ? "sibling" : "none"
      });
      
      await payment.save();
      created++;
    }
    
    res.json({
      success: true,
      message: `Generated ${created} payments, skipped ${skipped}`,
      created,
      skipped
    });
    
  } catch (error) {
    console.error("Generate payments error:", error);
    res.status(500).json({ message: "Failed to generate payments" });
  }
};

// ==================== VIEW STUDENT PAYMENTS ====================

// Get all students payment status (Admin view)
export const getAllStudentPayments = async (req, res) => {
  try {
    const { academicYear, grade, section, status, search } = req.query;
    
    let query = {};
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;
    
    // Get students with filters
    let studentQuery = {};
    if (grade) studentQuery.grade = grade;
    if (section) studentQuery.section = section;
    if (search) {
      studentQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    const students = await Student.find(studentQuery).select('fullName username grade section stream parent');
    
    const results = [];
    
    for (const student of students) {
      const payments = await Payment.find({
        student: student._id,
        academicYear: academicYear
      }).sort({ monthIndex: 1 });
      
      const summary = await StudentPaymentSummary.findOne({
        student: student._id,
        academicYear: academicYear
      });
      
      results.push({
        student: {
          _id: student._id,
          fullName: student.fullName,
          username: student.username,
          grade: student.grade,
          section: student.section,
          stream: student.stream
        },
        payments,
        summary: summary || {
          totalDue: 0,
          totalPaid: 0,
          balance: 0,
          isSuspended: false
        }
      });
    }
    
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// Get single student payment details
export const getStudentPayments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear } = req.query;

    const accessibleStudent = await resolveAccessibleStudent(req.user, studentId);
    if (!accessibleStudent) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const payments = await Payment.find({
      student: accessibleStudent._id,
      academicYear: academicYear
    }).sort({ monthIndex: 1 });
    
    const summary = await StudentPaymentSummary.findOne({
      student: accessibleStudent._id,
      academicYear: academicYear
    });
    
    const student = await Student.findById(accessibleStudent._id).select('fullName username grade section stream');
    
    res.json({
      success: true,
      data: {
        student,
        payments,
        summary: summary || {
          totalDue: 0,
          totalPaid: 0,
          balance: 0,
          isSuspended: false
        }
      }
    });
  } catch (error) {
    console.error("Get student payments error:", error);
    res.status(500).json({ message: "Failed to fetch student payments" });
  }
};

// ==================== MANUAL PAYMENT ENTRY ====================

// Manual payment entry (cash, bank transfer)
export const manualPaymentEntry = async (req, res) => {
  try {
    const {
      studentId,
      academicYear,
      month,
      amount,
      paymentMethod,
      remarks,
      discountAmount,
      waiveLateFee
    } = req.body;
    
    // Find the payment record
    const payment = await Payment.findOne({
      student: studentId,
      academicYear,
      month: month
    });
    
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    
    // Calculate late fee
    let lateFee = payment.lateFee;
    if (!waiveLateFee && payment.status === "overdue") {
      const today = new Date();
      const daysOverdue = Math.floor((today - payment.dueDate) / (1000 * 60 * 60 * 24));
      if (daysOverdue > 0) {
        const settings = await PaymentSettings.findOne({ academicYear });
        const maxLateFee = (payment.amountDue * settings.maxLateFeePercent) / 100;
        lateFee = Math.min(daysOverdue * settings.lateFeePerDay, maxLateFee);
      }
    }
    
    // Calculate total amount
    const finalDiscount = discountAmount || payment.discountAmount;
    const totalAmount = payment.amountDue + lateFee - finalDiscount;
    
    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Update payment
    payment.amountPaid = amount;
    payment.lateFee = lateFee;
    payment.discountAmount = finalDiscount;
    payment.totalAmount = totalAmount;
    payment.status = amount >= totalAmount ? "paid" : "partial";
    payment.paidDate = new Date();
    payment.paymentMethod = paymentMethod;
    payment.receiptNumber = receiptNumber;
    payment.remarks = remarks;
    payment.approvedBy = req.user.id;
    
    await payment.save();
    
    // Update student summary
    await updateStudentSummary(studentId, academicYear);
    
    // Record history
    await PaymentHistory.create({
      payment: payment._id,
      student: studentId,
      action: "manual_entry",
      newData: payment.toObject(),
      amount: amount,
      performedBy: req.user.id,
      remarks: `Manual payment: ${paymentMethod}`
    });
    
    // Send notification to student/parent
    await createNotification(
      studentId,
      "STUDENT",
      "Payment Received",
      `Payment of ${amount} Birr received for ${month}. Receipt: ${receiptNumber}`,
      "SUCCESS",
      { paymentId: payment._id, amount, month }
    );
    
    res.json({
      success: true,
      message: "Payment recorded successfully",
      receiptNumber
    });
    
  } catch (error) {
    console.error("Manual payment error:", error);
    res.status(500).json({ message: "Failed to record payment" });
  }
};

// ==================== APPLY FINES AUTOMATICALLY ====================

// Apply late fees to overdue payments (Run this daily via cron job)
export const applyLateFees = async (req, res) => {
  try {
    const today = new Date();
    const settings = await PaymentSettings.findOne({ isActive: true });
    
    // Find overdue payments
    const overduePayments = await Payment.find({
      status: { $in: ["pending", "partial"] },
      dueDate: { $lt: today },
      paidDate: null
    }).populate('student');
    
    let updated = 0;
    
    for (const payment of overduePayments) {
      const daysOverdue = Math.floor((today - payment.dueDate) / (1000 * 60 * 60 * 24));
      
      if (daysOverdue > settings.gracePeriodDays) {
        const fineDays = daysOverdue - settings.gracePeriodDays;
        const maxLateFee = (payment.amountDue * settings.maxLateFeePercent) / 100;
        const lateFee = Math.min(fineDays * settings.lateFeePerDay, maxLateFee);
        
        payment.lateFee = lateFee;
        payment.status = "overdue";
        payment.fineDays = fineDays;
        payment.fineAppliedAt = today;
        
        await payment.save();
        updated++;
        
        // Send notification
        await createNotification(
          payment.student._id,
          "STUDENT",
          "Late Fee Applied",
          `A late fee of ${lateFee} Birr has been applied to your ${payment.month} payment.`,
          "WARNING",
          { paymentId: payment._id, lateFee, daysOverdue: fineDays }
        );
      }
    }
    
    res.json({
      success: true,
      message: `Applied fines to ${updated} payments`,
      updated
    });
    
  } catch (error) {
    console.error("Apply late fees error:", error);
    res.status(500).json({ message: "Failed to apply late fees" });
  }
};

// ==================== STUDENT SUSPENSION ====================

// Check and suspend students with excessive overdue payments
export const checkAndSuspendStudents = async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne({ isActive: true });
    const today = new Date();
    
    // Find students with multiple overdue payments
    const overdueStudents = await Payment.aggregate([
      {
        $match: {
          status: "overdue",
          paidDate: null
        }
      },
      {
        $group: {
          _id: "$student",
          overdueMonths: { $sum: 1 },
          totalAmount: { $sum: "$amountDue" }
        }
      },
      {
        $match: {
          overdueMonths: { $gte: settings.suspensionAfterMonths }
        }
      }
    ]);
    
    let suspended = 0;
    
    for (const studentData of overdueStudents) {
      let summary = await StudentPaymentSummary.findOne({
        student: studentData._id,
        academicYear: settings.academicYear
      });
      
      if (!summary) {
        summary = new StudentPaymentSummary({
          student: studentData._id,
          academicYear: settings.academicYear
        });
      }
      
      if (!summary.isSuspended) {
        summary.isSuspended = true;
        summary.suspendedAt = today;
        summary.suspensionReason = `Payment overdue for ${studentData.overdueMonths} months`;
        await summary.save();
        suspended++;
        
        // Send suspension notification
        await createNotification(
          studentData._id,
          "STUDENT",
          "Account Suspended",
          `Your account has been suspended due to overdue payments for ${studentData.overdueMonths} months. Please contact the admin.`,
          "ERROR",
          { overdueMonths: studentData.overdueMonths }
        );
      }
    }
    
    res.json({
      success: true,
      message: `Suspended ${suspended} students`,
      suspended
    });
    
  } catch (error) {
    console.error("Check suspension error:", error);
    res.status(500).json({ message: "Failed to check suspensions" });
  }
};

// ==================== REPORTS ====================

// Generate payment reports
export const generatePaymentReport = async (req, res) => {
  try {
    const { academicYear, reportType, startDate, endDate, grade, section } = req.query;
    
    let reportData = {};
    
    switch (reportType) {
      case "monthly_collection":
        reportData = await getMonthlyCollectionReport(academicYear);
        break;
      case "overdue":
        reportData = await getOverdueReport(academicYear, grade, section);
        break;
      case "class_wise":
        reportData = await getClassWiseReport(academicYear);
        break;
      case "fine_collected":
        reportData = await getFineCollectedReport(academicYear, startDate, endDate);
        break;
      default:
        reportData = await getMonthlyCollectionReport(academicYear);
    }
    
    res.json({ success: true, data: reportData });
    
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

// ==================== HELPER FUNCTIONS ====================

const getMonthIndex = (month) => {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  return months.indexOf(month);
};

const getMonthNumber = (month) => {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];
  return months.indexOf(month);
};

const getSiblingCount = async (parentId) => {
  if (!parentId) return 1;
  const siblings = await Student.find({ parent: parentId });
  return siblings.length;
};

const updateStudentSummary = async (studentId, academicYear) => {
  const payments = await Payment.find({
    student: studentId,
    academicYear: academicYear
  });
  
  const totalDue = payments.reduce((sum, p) => sum + p.amountDue, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalDiscount = payments.reduce((sum, p) => sum + p.discountAmount, 0);
  const totalLateFee = payments.reduce((sum, p) => sum + p.lateFee, 0);
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
  summary.totalDiscount = totalDiscount;
  summary.totalLateFee = totalLateFee;
  summary.balance = balance;
  summary.monthsOverdue = monthsOverdue;
  
  await summary.save();
};

const getMonthlyCollectionReport = async (academicYear) => {
  const payments = await Payment.find({
    academicYear: academicYear,
    status: "paid"
  });
  
  const monthlyData = {};
  
  payments.forEach(payment => {
    if (!monthlyData[payment.month]) {
      monthlyData[payment.month] = {
        month: payment.month,
        expected: 0,
        collected: 0,
        discount: 0,
        lateFee: 0,
        count: 0
      };
    }
    monthlyData[payment.month].expected += payment.amountDue;
    monthlyData[payment.month].collected += payment.amountPaid;
    monthlyData[payment.month].discount += payment.discountAmount;
    monthlyData[payment.month].lateFee += payment.lateFee;
    monthlyData[payment.month].count++;
  });
  
  return Object.values(monthlyData);
};

const getOverdueReport = async (academicYear, grade, section) => {
  let query = { academicYear, status: "overdue" };
  
  const payments = await Payment.find(query).populate('student');
  
  let filteredPayments = payments;
  if (grade) {
    filteredPayments = filteredPayments.filter(p => p.student?.grade == grade);
  }
  if (section) {
    filteredPayments = filteredPayments.filter(p => p.student?.section === section);
  }
  
  return filteredPayments.map(p => ({
    studentName: p.student?.fullName,
    grade: p.student?.grade,
    section: p.student?.section,
    month: p.month,
    amountDue: p.amountDue,
    lateFee: p.lateFee,
    totalDue: p.amountDue + p.lateFee,
    daysOverdue: Math.floor((new Date() - p.dueDate) / (1000 * 60 * 60 * 24))
  }));
};

const getClassWiseReport = async (academicYear) => {
  const payments = await Payment.find({ academicYear }).populate('student');
  
  const classData = {};
  
  payments.forEach(payment => {
    const grade = payment.student?.grade || "Unknown";
    if (!classData[grade]) {
      classData[grade] = {
        grade,
        totalStudents: 0,
        totalExpected: 0,
        totalCollected: 0,
        totalDiscount: 0,
        totalLateFee: 0,
        paidCount: 0
      };
    }
    
    classData[grade].totalExpected += payment.amountDue;
    classData[grade].totalCollected += payment.amountPaid;
    classData[grade].totalDiscount += payment.discountAmount;
    classData[grade].totalLateFee += payment.lateFee;
    if (payment.status === "paid") classData[grade].paidCount++;
  });
  
  // Add student counts
  const studentsByGrade = await Student.aggregate([
    { $group: { _id: "$grade", count: { $sum: 1 } } }
  ]);
  
  studentsByGrade.forEach(g => {
    if (classData[g._id]) {
      classData[g._id].totalStudents = g.count;
    }
  });
  
  return Object.values(classData);
};

const getFineCollectedReport = async (academicYear, startDate, endDate) => {
  let query = { academicYear, lateFee: { $gt: 0 } };
  if (startDate && endDate) {
    query.fineAppliedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  const payments = await Payment.find(query).populate('student');
  
  return payments.map(p => ({
    studentName: p.student?.fullName,
    grade: p.student?.grade,
    section: p.student?.section,
    month: p.month,
    fineAmount: p.lateFee,
    fineDays: p.fineDays,
    appliedAt: p.fineAppliedAt
  }));
};

// Get academic years for payments
export const getPaymentAcademicYears = async (req, res) => {
  try {
    // Get unique academic years from payments
    const payments = await Payment.aggregate([
      {
        $group: {
          _id: "$academicYear",
          year: { $first: "$academicYear" }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    const academicYears = payments.map(p => p._id).filter(Boolean);
    
    // If no payments exist, generate current academic year
    if (academicYears.length === 0) {
      const currentYear = new Date().getFullYear();
      const ethiopianYear = currentYear - 8;
      academicYears.push(`${ethiopianYear} EC - ${ethiopianYear + 1} EC`);
    }
    
    res.json({ success: true, data: academicYears });
  } catch (error) {
    console.error("Get payment academic years error:", error);
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
};
// Get children for parent (for parent payment view)
export const getParentChildren = async (req, res) => {
  try {
    if (req.user.role !== "PARENT") {
      return res.status(403).json({ message: "Access denied" });
    }

    const parentId = req.user.id;
    const children = await Student.find({ parent: parentId }).select('fullName username grade section stream');
    res.json({ success: true, data: children });
  } catch (error) {
    console.error("Get parent children error:", error);
    res.status(500).json({ message: "Failed to fetch children" });
  }
};
