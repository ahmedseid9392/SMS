import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.model.js";

const generateTeacherUsername = async () => {
  const count = await Teacher.countDocuments();
  return `GVS2024${String(count + 1).padStart(3, "0")}`;
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
    const defaultPassword = "ChangeMe@123";
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

// GET ALL TEACHERS

export const getTeachers = async (req, res) => {
  try {
    const filters = {};

    if (req.query.name)
      filters.fullName = { $regex: req.query.name, $options: "i" };

    if (req.query.subject)
      filters.subject = { $regex: req.query.subject, $options: "i" };

    const teachers = await Teacher.find(filters).select("-password");

    res.json({ teachers });
  } catch (error) {
    console.error("GET Teachers error:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

// GET TEACHER BY ID

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (error) {
    console.error("GET Teacher by ID error:", error);
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
};


// UPDATE TEACHER

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher)
      return res.status(404).json({ message: "Teacher not found" });

    Object.assign(teacher, req.body);

    await teacher.save();

    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    console.error("UPDATE Teacher error:", error);
    res.status(500).json({ message: "Failed to update teacher" });
  }
};


// DELETE TEACHER

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("DELETE Teacher error:", error);
    res.status(500).json({ message: "Failed to delete teacher" });
  }
};
