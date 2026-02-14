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

    const semKey = semester === 1 ? "sem1" : "sem2";

    const midScore = Number(mid) || 0;
    const quizScore = Number(quiz) || 0;
    const assignmentScore = Number(assignment) || 0;
    const finalScore = Number(final) || 0;

    const total = midScore + quizScore + assignmentScore + finalScore;

    // LOAD EXISTING DOC
    let grade = await Grade.findOne({
      student: studentId,
      teacher: req.user.id,
      course: courseId
    });

    if (!grade) {
      grade = new Grade({
        student: studentId,
        teacher: req.user.id,
        course: courseId
      });
    }

    // DRAFT SAVE
    if (isDraft) {
      grade.scores[semKey] = {
        mid: midScore,
        quiz: quizScore,
        assignment: assignmentScore,
        final: finalScore,
        total,
        status: null,
        locked: false
      };

      await grade.save();
      return res.json({ success: true, draft: true, grade });
    }

    // FINAL SUBMIT
    const weights = await GradingSetting.findOne();
    if (!weights) {
      return res.status(400).json({ message: "Grading settings not found" });
    }

    const valid =
      midScore <= weights.midWeight &&
      quizScore <= weights.quizWeight &&
      assignmentScore <= weights.assignmentWeight &&
      finalScore <= weights.finalWeight;

    if (!valid) {
      return res.status(400).json({ message: "Score exceeds maximum allowed" });
    }

    grade.scores[semKey] = {
      mid: midScore,
      quiz: quizScore,
      assignment: assignmentScore,
      final: finalScore,
      total,
      locked: true,
      status: total >= 50 ? "PASS" : "FAIL"
    };

    // CALCULATE AVERAGE ONLY IF SEM2 SUBMITTED
    const s1 = grade.scores.sem1?.total;
    const s2 = grade.scores.sem2?.total;

    if (s1 && s2) {
      grade.average = Number(((s1 + s2) / 2).toFixed(2));
    }

    await grade.save();

    res.json({ success: true, grade });

  } catch (err) {
    console.error("Submit Grade Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};






// TEACHER VIEW

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



// ADMIN VIEW

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



// PARENT VIEW

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



// STUDENT VIEW

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

    const grade = await Grade.findOne({ student: studentId, course: courseId });

    res.json({
      success: true,
      sem1: grade?.scores?.sem1?.total || 0,
      sem2: grade?.scores?.sem2?.total || 0,
      average: grade?.average || null
    });

  } catch (err) {
    console.error("Semester total error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
