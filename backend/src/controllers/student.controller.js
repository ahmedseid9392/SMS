import Student from "../models/Student.model.js";

// AUTO GENERATE USERNAME → GVS2024XXX
const generateUsername = async () => {
  const lastStudent = await Student.findOne().sort({ createdAt: -1 });

  const nextNumber = lastStudent
    ? parseInt(lastStudent.username.slice(8)) + 1
    : 1;

  return `GVS2024${String(nextNumber).padStart(3, "0")}`;
};

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    console.log("📥 Incoming Student:", req.body);  
    const { fullName, sex, grade, stream, section } = req.body;
     

    const username = await generateUsername();
    const password = "123456"; // default

    const student = await Student.create({ // new Student and remove await and create
      username,
      password,
      fullName,
      sex,
      grade,
      stream,
      section,
      role: "STUDENT"
    });
 //add await student.save()
    res.status(201).json(student);

  } catch (error) {
      console.log("❌ CREATE STUDENT ERROR:", err);
    res.status(500).json({ error: error.message });
  }
};

// GET STUDENTS (with filters + pagination)
export const getStudents = async (req, res) => {
  try {
    const { grade, section, stream, username, page = 1, limit = 10 } = req.query;

    const query = {};

    if (grade) query.grade = grade;
    if (section) query.section = section;
    if (stream) query.stream = stream;
    if (username) query.username = new RegExp(username, "i");

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-password");

    const total = await Student.countDocuments(query);

    res.json({ students, total });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
