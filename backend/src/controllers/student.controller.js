import Student from "../models/Student.model.js";
import bcrypt from "bcryptjs";
const generateStudentUsername = async () => {
  const lastStudent = await Student.findOne({ role: "STUDENT" })
    .sort({ createdAt: -1 });

  const prefix = "GVS2024";

  const lastNumber = lastStudent
    ? parseInt(lastStudent.username.replace(prefix, "")) || 0
    : 0;

  const nextNumber = lastNumber + 1;

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};




export const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      sex,
      grade,
      section,
      stream,
    } = req.body;

    // Auto-generate username → Example: GVS + timestamp
    const username = await generateStudentUsername();

    // Default password
    const defaultPassword = "ChangeMe@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const student = new Student({
      username:username,
      password: hashedPassword,
      fullName,
      sex,
      grade,
      section,
      stream: grade >= 11 ? stream : undefined,
      mustChangePassword: true,
    });

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      username,
      defaultPassword,
      id: student._id,
    });
  } catch (error) {
    console.error("Register Student Error:", error);
    res.status(500).json({ message: "Failed to register student" });
  }
};
// GET STUDENTS (with filters + pagination)
export const getStudents = async (req, res) => {
  try {
    const filters = {};

    if (req.query.username)
      filters.username = { $regex: req.query.username, $options: "i" };

    if (req.query.grade) filters.grade = req.query.grade;

    if (req.query.section)
      filters.section = { $regex: req.query.section, $options: "i" };

    if (req.query.stream) filters.stream = req.query.stream;

    const students = await Student.find(filters);

    res.json({ students });
    
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({ message: "Server error fetching students" });
  }
};



// GET BY ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(student, req.body);
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
