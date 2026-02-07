import Grade from "../models/Grade.model.js";
import GradingSetting from "../models/GradingSetting.model.js";

export const submitGrade = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId, courseId, semester, mid, quiz, assignment, final } = req.body;

    // Check existing grade submission
    const existing = await Grade.findOne({
      student: studentId,
      teacher: teacherId,
      course: courseId,
      semester
    });

    if (existing) {
      return res.status(400).json({ message: "Grade already submitted, cannot update" });
    }

    // Get grading settings
    let setting = await GradingSetting.findOne();
    if (!setting) {
      setting = await GradingSetting.create({});
    }

    // Calculate semester score
    const total =
      (mid * setting.midWeight) +
      (quiz * setting.quizWeight) +
      (assignment * setting.assignmentWeight) +
      (final * setting.finalWeight);

    // Save grade entry
    const grade = await Grade.create({
      student: studentId,
      teacher: teacherId,
      course: courseId,
      semester,
      scores: { mid, quiz, assignment, final },
      total,
      locked: true
    });

    // If semester 2 submitted → calculate year total
    if (semester === 2) {
      const sem1 = await Grade.findOne({
        student: studentId,
        teacher: teacherId,
        course: courseId,
        semester: 1
      });

      if (sem1) {
        const yearTotal = (sem1.total + grade.total) / 2;
        const status = yearTotal >= 50 ? "PASS" : "FAIL";

        sem1.yearTotal = yearTotal;
        sem1.status = status;
        await sem1.save();

        grade.yearTotal = yearTotal;
        grade.status = status;
        await grade.save();
      }
    }

    res.status(201).json({
      message: "Grade submitted successfully",
      grade
    });

  } catch (error) {
    console.error("Grade Submission Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherGrades = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId, grade, section, stream } = req.query;

    const grades = await Grade.find({ teacher: teacherId })
      .populate("student", "username fullName grade section stream")
      .populate("course", "name")
      .sort({ createdAt: -1 });

    res.json({ grades });
  } catch (error) {
    console.error("Get Teacher Grades Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("student", "username fullName grade section stream")
      .populate("teacher", "fullName")
      .populate("course", "name");

    res.json({ grades });
  } catch (error) {
    console.error("Get All Grades Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getParentGrades = async (req, res) => {
  try {
    const parentId = req.user.id;

    const student = await Student.findOne({ parent: parentId });

    if (!student) return res.status(404).json({ message: "Student not found" });

    const grades = await Grade.find({ student: student._id })
      .populate("course", "name");

    res.json({ grades });

  } catch (error) {
    console.error("Get Parent Grades Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user.id;

    const grades = await Grade.find({ student: studentId })
      .populate("course", "name");

    res.json({ grades });
  } catch (error) {
    console.error("Get Student Grades Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



