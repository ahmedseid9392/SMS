import Grade from "../models/Grade.model.js";
import GradingSetting from "../models/GradingSetting.model.js";
import Student from "../models/Student.model.js";

export const submitGrade = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      semester,
      mid,
      quiz,
      assignment,
      final,
      isDraft
    } = req.body;

    if (!studentId || !courseId || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert all scores to safe numeric values
    const midScore = Number(mid) || 0;
    const quizScore = Number(quiz) || 0;
    const assignmentScore = Number(assignment) || 0;
    const finalScore = Number(final) || 0;

    // Default values for draft
    let total = null;
    let status = null;
    let locked = false;

    // ✔ FINAL SUBMIT VALIDATION
    if (!isDraft) {
      const weights = await GradingSetting.findOne();

      if (!weights)
        return res.status(400).json({ message: "Grading settings not found" });

      const valid =
        midScore <= weights.midWeight &&
        quizScore <= weights.quizWeight &&
        assignmentScore <= weights.assignmentWeight &&
        finalScore <= weights.finalWeight;

      if (!valid) {
        return res.status(400).json({ message: "Score exceeds maximum allowed" });
      }

           // DELETE any existing draft before saving final grade
  await Grade.deleteOne({
    student: studentId,
    course: courseId,
    teacher: req.user.id,
    semester,
    locked: false
  });

      total = midScore + quizScore + assignmentScore + finalScore;
      total = Number(total.toFixed(2)); // decimals allowed

      status = total >= 50 ? "PASS" : "FAIL";
      locked = true;
    }

    // ✔ UPDATE OR CREATE
    const grade = await Grade.findOneAndUpdate(
      {
        student: studentId,
        course: courseId,
        teacher: req.user.id,
        semester,
      },
      {
        scores: {
          mid: midScore,
          quiz: quizScore,
          assignment: assignmentScore,
          final: finalScore,
          total,
        },
        status,
        locked,
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, grade });
  } catch (err) {
    console.error("Submit Grade Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};




//--------------------------------------------------
// TEACHER VIEW
//--------------------------------------------------
export const getTeacherGrades = async (req, res) => {
  try {
    const teacherId = req.user.id;

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


//--------------------------------------------------
// ADMIN VIEW
//--------------------------------------------------
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


//--------------------------------------------------
// PARENT VIEW
//--------------------------------------------------
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


//--------------------------------------------------
// STUDENT VIEW
//--------------------------------------------------
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


export const saveDraft = async (req, res) => {
  try {
    const { studentId, courseId, semester, mid, quiz, assignment, final } = req.body;
    const teacherId = req.user.id;

    const toNumber = (v) => (v !== null && v !== undefined ? Number(v) : 0);

    const total =
      toNumber(mid) +
      toNumber(quiz) +
      toNumber(assignment) +
      toNumber(final);

    const updated = await Grade.findOneAndUpdate(
      { student: studentId, course: courseId, teacher: teacherId, semester },
      {
        scores: { mid, quiz, assignment, final, total },
        status: null,
        locked: false,  // ✔ DRAFT
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Draft Saved", grade: updated });
  } catch (err) {
    console.error("Grade Draft Save Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



export const unlockGrade = async (req, res) => {
  try {
    const { gradeId } = req.body;

    const updated = await Grade.findByIdAndUpdate(
      gradeId,
      { locked: false },
      { new: true }
    );

    res.status(200).json({ message: "Grade Unlocked", grade: updated });
  } catch (err) {
    console.error("Grade Unlock Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};









export const getGradesForClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    const grades = await Grade.find({
      teacher: req.user.id,
      course: classId,
    }).populate("student");

    res.status(200).json({ success: true, grades });
  } catch (err) {
    console.error("Load Grades Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStudentSemesterTotals = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const grades = await Grade.find({
      student: studentId,
      course: courseId
    });

    const sem1 = grades.find(g => g.semester === 1)?.scores?.total || 0;
    const sem2 = grades.find(g => g.semester === 2)?.scores?.total || 0;

    const average = (sem1 && sem2) ? Number(((sem1 + sem2) / 2).toFixed(2)) : null;

    res.json({
      success: true,
      sem1,
      sem2,
      average
    });

  } catch (err) {
    console.error("Semester total error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

