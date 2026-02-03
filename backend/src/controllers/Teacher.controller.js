import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.model.js";

const generateTeacherUsername = async () => {
  const count = await Teacher.countDocuments();
  return `TCHR2024${String(count + 1).padStart(3, "0")}`;
};

export const registerTeacher = async (req, res) => {
  try {
    const { fullName, phone, subject } = req.body;

    if (!fullName || !phone || !subject) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate username
    const username = await generateTeacherUsername();

    // Default password
    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create teacher
    const teacher = await Teacher.create({
      fullName,
      phone,
      subject,
      username,
      password: hashedPassword,
      role: "TEACHER",
      mustChangePassword: true
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher: {
        id: teacher._id,
        fullName: teacher.fullName,
        username: teacher.username,
        subject: teacher.subject,
        phone: teacher.phone,
        role: teacher.role,
        mustChangePassword: teacher.mustChangePassword,
      }
    });

  } catch (error) {
    console.error("Teacher Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
