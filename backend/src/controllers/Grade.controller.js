import mongoose from 'mongoose';
import Grade from "../models/Grade.model.js";
import GradingSetting from "../models/GradingSetting.model.js";
import Student from "../models/Student.model.js";
import AcademicYear from "../models/AcademicYear.model.js";

const getParentAccessibleStudent = async (parentId, studentId = null) => {
  const query = { parent: parentId };
  if (studentId) {
    query._id = studentId;
  }
  return await Student.findOne(query).select("fullName username grade section stream");
};

const buildReleasedResultsPayload = async (studentId, semester, academicYearId = null) => {
  const query = {
    student: studentId,
    isReleased: true
  };

  if (academicYearId && academicYearId !== "default") {
    query["academicYear._id"] = academicYearId;
  }

  const grades = await Grade.find(query)
    .populate("course", "name gradeLevel stream")
    .populate("teacher", "fullName");

  if (grades.length === 0) {
    const student = await Student.findById(studentId).select("fullName username grade section stream");
    return {
      student: student
        ? {
            name: student.fullName,
            username: student.username,
            grade: student.grade,
            section: student.section,
            stream: student.stream || "",
          }
        : null,
      results: [],
      summary: {
        totalScore: "0.00",
        average: "0",
        totalCourses: 0,
        status: "No Results",
      },
    };
  }

  let totalScore = 0;
  let totalCourses = 0;
  const courseResults = [];

  for (const grade of grades) {
    const semKey = semester === "2" ? "sem2" : "sem1";
    const scores = grade[semKey];

    if (scores && scores.locked) {
      totalScore += scores.total || 0;
      totalCourses++;

      courseResults.push({
        _id: grade._id,
        courseId: grade.course._id,
        courseName: grade.course.name,
        gradeLevel: grade.course.gradeLevel,
        stream: grade.course.stream,
        mid: scores.mid || 0,
        quiz: scores.quiz || 0,
        assignment: scores.assignment || 0,
        final: scores.final || 0,
        total: scores.total || 0,
        status: (scores.total || 0) >= 50 ? "Pass" : "Fail",
      });
    }
  }

  const average = totalCourses > 0 ? (totalScore / totalCourses).toFixed(2) : 0;
  const overallStatus = average >= 50 ? "Pass" : "Fail";
  const student = await Student.findById(studentId).select("fullName username grade section stream");

  return {
    student: {
      name: student.fullName,
      username: student.username,
      grade: student.grade,
      section: student.section,
      stream: student.stream || "",
    },
    results: courseResults,
    summary: {
      totalScore: totalScore.toFixed(2),
      average,
      totalCourses,
      status: overallStatus,
    },
  };
};

const getAcademicYearsForStudent = async (studentId) => {
  const grades = await Grade.find({
    student: studentId,
    isReleased: true,
  }).select("academicYear");

  const years = [];
  const yearMap = new Map();

  for (const grade of grades) {
    if (grade.academicYear && grade.academicYear._id && !yearMap.has(grade.academicYear._id.toString())) {
      yearMap.set(grade.academicYear._id.toString(), {
        _id: grade.academicYear._id,
        name: grade.academicYear.name || `${grade.academicYear.year} Academic Year`,
        ethiopianYear: grade.academicYear.ethiopianYear || grade.academicYear.year,
        gregorianYear: grade.academicYear.gregorianYear || "",
      });
      years.push(yearMap.get(grade.academicYear._id.toString()));
    }
  }

  if (years.length === 0) {
    try {
      const allYears = await AcademicYear.find({}).sort({ createdAt: -1 });
      for (const year of allYears) {
        years.push({
          _id: year._id,
          name: year.name,
          ethiopianYear: year.ethiopianYear,
          gregorianYear: year.gregorianYear,
        });
      }
    } catch (err) {
      console.log("AcademicYear fallback error:", err.message);
    }
  }

  if (years.length === 0) {
    const currentYear = new Date().getFullYear();
    const ethiopianYear = currentYear - 8;
    years.push({
      _id: "default",
      name: `${ethiopianYear} EC - ${ethiopianYear + 1} EC`,
      ethiopianYear: `${ethiopianYear} EC`,
      gregorianYear: `${currentYear}/${currentYear + 1}`,
    });
  }

  return years;
};

// Get current active academic year
export const getCurrentAcademicYear = async (req, res) => {
  try {
    let academicYear = await AcademicYear.findOne({ isActive: true, status: 'active' });
    
    if (!academicYear) {
      // Create default academic year if none exists
      const currentYear = new Date().getFullYear();
      const ethiopianYear = currentYear - 8;
      
      academicYear = await AcademicYear.create({
        name: `${ethiopianYear} EC - ${ethiopianYear + 1} EC`,
        ethiopianYear: `${ethiopianYear} EC`,
        gregorianYear: `${currentYear}/${currentYear + 1}`,
        calendar: 'EC',
        isActive: true,
        status: 'active',
        semesters: [
          { semester: 1, name: "First Semester", isActive: true },
          { semester: 2, name: "Second Semester", isActive: false }
        ]
      });
    }
    
    res.json({
      success: true,
      data: academicYear
    });
  } catch (error) {
    console.error("Error fetching academic year:", error);
    res.status(500).json({ message: "Failed to fetch academic year" });
  }
};

// Get all academic years
export const getAllAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: academicYears
    });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
};

// Create academic year
export const createAcademicYear = async (req, res) => {
  try {
    const { 
      name, ethiopianYear, gregorianYear, calendar,
      startDateEC, endDateEC, startDateGC, endDateGC,
      semesters, isActive
    } = req.body;
    
    // Validate Ethiopian year format
    const ethiopianYearRegex = /^\d{4}\s*EC$/i;
    if (!ethiopianYearRegex.test(ethiopianYear)) {
      return res.status(400).json({ 
        message: "Invalid Ethiopian year format. Use: '2017 EC'" 
      });
    }
    
    const academicYear = new AcademicYear({
      name,
      ethiopianYear,
      gregorianYear,
      calendar,
      startDateEC,
      endDateEC,
      startDateGC,
      endDateGC,
      semesters,
      isActive: isActive || false,
      status: isActive ? 'active' : 'upcoming'
    });
    
    await academicYear.save();
    
    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      data: academicYear
    });
  } catch (error) {
    console.error("Error creating academic year:", error);
    res.status(500).json({ message: "Failed to create academic year" });
  }
};

// Set active academic year
export const setActiveAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deactivate all academic years
    await AcademicYear.updateMany({}, { isActive: false, status: 'completed' });
    
    // Activate selected academic year
    const academicYear = await AcademicYear.findByIdAndUpdate(
      id,
      { isActive: true, status: 'active' },
      { new: true }
    );
    
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    res.json({
      success: true,
      message: "Academic year activated",
      data: academicYear
    });
  } catch (error) {
    console.error("Error setting active academic year:", error);
    res.status(500).json({ message: "Failed to set active academic year" });
  }
};

// Update academic year
export const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const academicYear = await AcademicYear.findByIdAndUpdate(id, updates, { new: true });
    
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    res.json({
      success: true,
      message: "Academic year updated successfully",
      data: academicYear
    });
  } catch (error) {
    console.error("Error updating academic year:", error);
    res.status(500).json({ message: "Failed to update academic year" });
  }
};

// Delete academic year
export const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    if (academicYear.isActive) {
      return res.status(400).json({ message: "Cannot delete active academic year" });
    }
    
    await academicYear.deleteOne();
    
    res.json({
      success: true,
      message: "Academic year deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting academic year:", error);
    res.status(500).json({ message: "Failed to delete academic year" });
  }
};
// Submit final grade (lock the grade)
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
      isDraft,
      academicYearId
    } = req.body;
    
    const teacherId = req.user.id;
    
    console.log("Submit Grade Request:", { studentId, courseId, semester, academicYearId });
    
    // Validate required fields
    if (!studentId || !courseId || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Validate scores are present (for final submission)
    if (!isDraft && (mid === undefined || quiz === undefined || assignment === undefined || final === undefined)) {
      return res.status(400).json({ message: "All score fields are required for submission" });
    }
    
    // Get weights for validation
    const weights = await GradingSetting.findOne();
    if (!weights) {
      return res.status(400).json({ message: "Grading settings not found" });
    }
    
    // Calculate total
    const midNum = Number(mid) || 0;
    const quizNum = Number(quiz) || 0;
    const assignmentNum = Number(assignment) || 0;
    const finalNum = Number(final) || 0;
    const total = midNum + quizNum + assignmentNum + finalNum;
    
    // Find existing grade record
    let grade = await Grade.findOne({ 
      student: studentId, 
      course: courseId,
      teacher: teacherId
    });
    
    if (!grade) {
      // Create new grade WITHOUT academic year first
      grade = new Grade({
        student: studentId,
        teacher: teacherId,
        course: courseId,
        isReleased: false
      });
      
      // Only add academic year if ID is provided and valid
      if (academicYearId && academicYearId !== 'default') {
        try {
          const AcademicYear = mongoose.model('AcademicYear');
          const academicYear = await AcademicYear.findById(academicYearId);
          if (academicYear) {
            grade.academicYear = {
              _id: academicYear._id,
              name: academicYear.name,
              year: academicYear.ethiopianYear || academicYear.name,
              ethiopianYear: academicYear.ethiopianYear,
              gregorianYear: academicYear.gregorianYear
            };
          }
        } catch (err) {
          console.log("Could not fetch academic year:", err.message);
          // Don't set academic year - continue without it
        }
      }
    }
    
    if (isDraft) {
      // Save as draft
      grade.draft = {
        semester: semester,
        mid: midNum,
        quiz: quizNum,
        assignment: assignmentNum,
        final: finalNum,
        total: total,
        savedAt: new Date()
      };
      
      await grade.save();
      
      console.log("Draft saved successfully");
      return res.status(200).json({ 
        success: true, 
        message: "Draft saved successfully",
        grade: grade
      });
      
    } else {
      // Submit final grade
      const semesterField = semester === 1 ? 'sem1' : 'sem2';
      grade[semesterField] = {
        mid: midNum,
        quiz: quizNum,
        assignment: assignmentNum,
        final: finalNum,
        total: total,
        locked: true,
        submittedAt: new Date(),
        submittedBy: teacherId
      };
      
      // Clear any draft for this semester
      if (grade.draft && grade.draft.semester === semester) {
        grade.draft = null;
      }
      
      await grade.save();
      
      console.log("Grade submitted successfully");
      return res.status(200).json({ 
        success: true, 
        message: "Grade submitted successfully",
        grade: grade
      });
    }
    
  } catch (err) {
    console.error("Submit Grade Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while submitting grade", 
      error: err.message 
    });
  }
};
//  admin calculate grade
export const adminComputeSemesterTotals = async (req, res) => {
  try {
    const grades = await Grade.find().populate("student");

    const map = {}; // studentId → { sumSem1, sumSem2 }

    grades.forEach(g => {
      const sid = g.student._id.toString();

      if (!map[sid]) map[sid] = { sumSem1: 0, sumSem2: 0 };

      map[sid].sumSem1 += g.sem1?.total || 0;
      map[sid].sumSem2 += g.sem2?.total || 0;
    });

    // update DB
    for (const grade of grades) {
      const s = map[grade.student._id.toString()];

      await Grade.updateMany(
        { student: grade.student._id },
        {
          sumSem1: s.sumSem1,
          sumSem2: s.sumSem2,
          finalSum: Number(((s.sumSem1 + s.sumSem2) / 2).toFixed(2))
        }
      );
    }

    res.json({ success: true, message: "Semester totals computed" });

  } catch (err) {
    console.error("Compute Totals Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//admin ranking 

export const adminComputeRanking = async (req, res) => {
  try {
    const allGrades = await Grade.find().populate("student");

    // group by (grade + section)
    const sectionGroups = {};

    allGrades.forEach(g => {
      const student = g.student;
      const key = `${student.grade}-${student.section}`;

      if (!sectionGroups[key]) sectionGroups[key] = [];
      sectionGroups[key].push(g);
    });

    // compute ranking for each section
    for (const key of Object.keys(sectionGroups)) {
      const group = sectionGroups[key];

      // sem1 rank
      group.sort((a, b) => b.sumSem1 - a.sumSem1);
      group.forEach((g, i) => {
        g.rankSem1 = i + 1;
        g.save();
      });

      // sem2 rank
      group.sort((a, b) => b.sumSem2 - a.sumSem2);
      group.forEach((g, i) => {
        g.rankSem2 = i + 1;
        g.save();
      });

      // final rank
      group.sort((a, b) => b.finalSum - a.finalSum);
      group.forEach((g, i) => {
        g.rankFinal = i + 1;
        g.save();
      });
    }

    res.json({ success: true, message: "Ranking computed" });

  } catch (err) {
    console.error("Ranking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//top 3
export const adminComputeTop3 = async (req, res) => {
  try {
    const grades = await Grade.find().populate("student");

    const sorted = grades.sort((a, b) => b.finalSum - a.finalSum);

    // reset all
    await Grade.updateMany({}, { isTop3: false, top3Position: null });

    // assign top 3
    sorted.slice(0, 3).forEach((g, index) => {
      g.isTop3 = true;
      g.top3Position = index + 1;
      g.save();
    });

    res.json({ success: true, message: "Top 3 assigned" });

  } catch (err) {
    console.error("Top3 Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//admin relese grade to student 
export const adminReleaseGrades = async (req, res) => {
  try {
    const { sectionKey, academicYearId } = req.body;
    
    let updateQuery = {};
    
    if (sectionKey) {
      // Release for specific section
      // You'll need to find students in that section
      const students = await Student.find({ 
        grade: sectionKey.split('-')[0],
        section: sectionKey.split('-')[2]
      });
      
      const studentIds = students.map(s => s._id);
      updateQuery = { student: { $in: studentIds } };
    }
    
    if (academicYearId) {
      updateQuery['academicYear._id'] = academicYearId;
    }
    
    await Grade.updateMany(
      updateQuery,
      { isReleased: true }
    );
    
    res.json({ 
      success: true, 
      message: "Grades released to students" 
    });
    
  } catch (err) {
    console.error("Release Error:", err);
    res.status(500).json({ message: "Server error" });
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
      .populate("student", "fullName grade section stream")
      .populate("teacher", "fullName")
      .populate("course", "name");

    const sections = {};

    grades.forEach((g) => {
      const gradeLevel = g.student.grade;
      const stream = g.student.stream;
      const section = g.student.section;

      const sectionKey = `${gradeLevel}-${stream}-${section}`;
      const studentId = g.student._id.toString();
      const courseName = g.course.name;

      if (!sections[sectionKey]) {
        sections[sectionKey] = {
          meta: {
            grade: gradeLevel,
            stream,
            section,
            courses: {}
          },
          students: {}
        };
      }

      // Save teacher per course
      sections[sectionKey].meta.courses[courseName] =
        g.teacher?.fullName || "N/A";

      if (!sections[sectionKey].students[studentId]) {
        sections[sectionKey].students[studentId] = {
          studentId,
          fullName: g.student.fullName,
          courses: {},
          sumSem1: 0,
          sumSem2: 0,
          finalSum: 0,
          average: 0,
          rank: 0,
          status: "Fail"
        };
      }

      // ✅ CORRECT TOTAL FETCH
      const sem1 = g.sem1?.total || 0;
      const sem2 = g.sem2?.total || 0;

      sections[sectionKey].students[studentId].courses[courseName] = {
        sem1Total: sem1,
        sem2Total: sem2
      };

      sections[sectionKey].students[studentId].sumSem1 += sem1;
      sections[sectionKey].students[studentId].sumSem2 += sem2;
    });

    // ✅ Compute Final Calculations
    Object.keys(sections).forEach((key) => {
      const studentsArr = Object.values(sections[key].students);

      studentsArr.forEach((s) => {
        s.finalSum = (s.sumSem1 + s.sumSem2) / 2;

        const totalCourses = Object.keys(s.courses).length;

        s.average = totalCourses
          ? s.finalSum / totalCourses
          : 0;

        s.status = s.average >= 50 ? "Pass" : "Fail";
      });

      // Rank by finalSum
      studentsArr.sort((a, b) => b.finalSum - a.finalSum);

      studentsArr.forEach((s, i) => {
               s.rank = i + 1;
      });

      sections[key].students = studentsArr;
    });

    res.json({ sections });

  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// PARENT VIEW

export const getParentGrades = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { studentId } = req.query;
    const student = await getParentAccessibleStudent(parentId, studentId);

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


/// Save draft grade
export const saveDraft = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      semester,
      mid,
      quiz,
      assignment,
      final,
      isDraft,
      academicYearId
    } = req.body;
    
    const teacherId = req.user.id;
    
    console.log("Save Draft Request:", { studentId, courseId, semester, academicYearId });
    
    // Validate required fields
    if (!studentId || !courseId || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Calculate total
    const midNum = Number(mid) || 0;
    const quizNum = Number(quiz) || 0;
    const assignmentNum = Number(assignment) || 0;
    const finalNum = Number(final) || 0;
    const total = midNum + quizNum + assignmentNum + finalNum;
    
    // Find existing grade record
    let grade = await Grade.findOne({ 
      student: studentId, 
      course: courseId,
      teacher: teacherId
    });
    
    if (!grade) {
      // Create new grade WITHOUT academic year first
      grade = new Grade({
        student: studentId,
        teacher: teacherId,
        course: courseId,
        isReleased: false
      });
      
      // Only add academic year if ID is provided and valid
      if (academicYearId && academicYearId !== 'default') {
        try {
          const AcademicYear = mongoose.model('AcademicYear');
          const academicYear = await AcademicYear.findById(academicYearId);
          if (academicYear) {
            grade.academicYear = {
              _id: academicYear._id,
              name: academicYear.name,
              year: academicYear.ethiopianYear || academicYear.name,
              ethiopianYear: academicYear.ethiopianYear,
              gregorianYear: academicYear.gregorianYear
            };
          }
        } catch (err) {
          console.log("Could not fetch academic year:", err.message);
        }
      }
    }
    
    // Save as draft
    grade.draft = {
      semester: semester,
      mid: midNum,
      quiz: quizNum,
      assignment: assignmentNum,
      final: finalNum,
      total: total,
      savedAt: new Date()
    };
    
    await grade.save();
    
    console.log("Draft saved successfully");
    res.status(200).json({ 
      success: true, 
      message: "Draft saved successfully",
      grade: grade
    });
    
  } catch (err) {
    console.error("Save Draft Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while saving draft", 
      error: err.message 
    });
  }
};




// POST /grades/unlock/:studentId/:courseId
export const unlockGrade = async (req, res) => {
  try {
    const gradeId = req.params.id;

    if (!gradeId) return res.status(400).json({ message: "Missing grade ID" });

    const grade = await Grade.findById(gradeId);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    grade.sem1.locked = false;
    grade.sem2.locked = false;
    await grade.save();

    res.json({ message: "Grade Unlocked", grade });

  } catch (error) {
    console.error("Unlock Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};










// Updated getGradesForClass with academic year filter
export const getGradesForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { academicYearId } = req.query;
    const teacherId = req.user.id;
    
    console.log("getGradesForClass called with:", { classId, academicYearId, teacherId });
    
    // Build query
    let query = { 
      course: classId,
      teacher: teacherId
    };
    
    // Only add academicYear filter if it's a valid ObjectId
    if (academicYearId && academicYearId !== 'default' && academicYearId !== 'null' && academicYearId !== '') {
      // Check if it's a valid ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(academicYearId);
      if (isValidObjectId) {
        query['academicYear._id'] = academicYearId;
      }
    }
    
    const grades = await Grade.find(query)
      .populate('student', 'fullName username grade section stream')
      .populate('course', 'name');
    
    console.log("Found grades:", grades.length);
    
    res.status(200).json({ 
      success: true, 
      grades: grades 
    });
  } catch (err) {
    console.error("Load Grades Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: err.message 
    });
  }
};
// Updated getStudentSemesterTotals with academic year
export const getStudentSemesterTotals = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const { academicYearId } = req.query;

    let query = { student: studentId, course: courseId };
    
    if (academicYearId) {
      const academicYear = await AcademicYear.findById(academicYearId);
      if (academicYear) {
        query["academicYear.year"] = academicYear.ethiopianYear;
      }
    }

    const grade = await Grade.findOne(query);

    res.json({
      success: true,
      sem1: grade?.sem1?.total || 0,
      sem2: grade?.sem2?.total || 0,
      average: grade ? ((grade.sem1?.total + grade.sem2?.total) / 2) : null
    });

  } catch (err) {
    console.error("Semester total error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update semester activation
export const updateSemesterStatus = async (req, res) => {
  try {
    const { academicYearId, semester, isActive } = req.body;
    
    const academicYear = await AcademicYear.findById(academicYearId);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    const semesterIndex = academicYear.semesters.findIndex(s => s.semester === semester);
    if (semesterIndex === -1) {
      return res.status(404).json({ message: "Semester not found" });
    }
    
    academicYear.semesters[semesterIndex].isActive = isActive;
    await academicYear.save();
    
    res.json({
      success: true,
      message: `Semester ${semester} ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: academicYear
    });
  } catch (error) {
    console.error("Error updating semester status:", error);
    res.status(500).json({ message: "Failed to update semester status" });
  }
};

// Check if all students in a class have submitted Semester 1 grades
// Check if all students have submitted Semester 1 grades
export const checkSemester1Completion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { academicYearId } = req.query;
    
    console.log("Checking Semester 1 completion for course:", courseId);
    console.log("Academic Year ID:", academicYearId);
    
    // First, find all students assigned to this course
    // You need to get the class/assignment for this course
    const TeacherAssignment = mongoose.model('TeacherAssignment');
    
    let assignment = null;
    try {
      assignment = await TeacherAssignment.findOne({ 
        course: courseId,
        academicYear: academicYearId 
      }).populate('students');
    } catch (err) {
      console.log("TeacherAssignment model not found or no assignment");
    }
    
    // If no assignment found, try to get students from Grade model
    let totalStudents = 0;
    let submittedCount = 0;
    let allStudentIds = [];
    
    if (assignment && assignment.students) {
      // Get all student IDs from the assignment
      allStudentIds = assignment.students.map(s => s._id.toString());
      totalStudents = allStudentIds.length;
      
      // Find grades for these students
      const grades = await Grade.find({ 
        course: courseId,
        student: { $in: allStudentIds },
        "academicYear._id": academicYearId 
      });
      
      // Count how many have submitted (sem1 locked)
      for (const studentId of allStudentIds) {
        const grade = grades.find(g => g.student.toString() === studentId);
        if (grade && grade.sem1 && grade.sem1.locked === true) {
          submittedCount++;
        }
      }
    } else {
      // Alternative: Get all grades for this course
      const grades = await Grade.find({ 
        course: courseId,
        "academicYear._id": academicYearId 
      });
      
      totalStudents = grades.length;
      submittedCount = grades.filter(g => g.sem1 && g.sem1.locked === true).length;
    }
    
    const allCompleted = totalStudents > 0 && submittedCount === totalStudents;
    const completionPercentage = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;
    
    console.log(`Total students: ${totalStudents}, Submitted: ${submittedCount}, All completed: ${allCompleted}`);
    
    res.json({
      success: true,
      allCompleted,
      completedCount: submittedCount,
      totalStudents: totalStudents,
      completionPercentage: completionPercentage
    });
    
  } catch (error) {
    console.error("Error checking semester 1 completion:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check semester completion", 
      error: error.message 
    });
  }
};
// Get submission status for all students in a class
export const getSemester1SubmissionStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { academicYearId } = req.query;
    
    // Get all grades for this course
    const grades = await Grade.find({ 
      course: courseId,
      "academicYear._id": academicYearId 
    }).populate('student', 'fullName username');
    
    // Get all students from the class assignment
    const assignment = await TeacherAssignment.findOne({ 
      course: courseId,
      academicYear: academicYearId 
    }).populate('students', 'fullName username');
    
    const submissionStatus = [];
    
    if (assignment && assignment.students) {
      for (const student of assignment.students) {
        const grade = grades.find(g => g.student.toString() === student._id.toString());
        const isSubmitted = grade?.sem1?.locked === true;
        
        submissionStatus.push({
          studentId: student._id,
          studentName: student.fullName,
          username: student.username,
          isSubmitted,
          submittedAt: grade?.sem1?.submittedAt || null,
          total: grade?.sem1?.total || 0
        });
      }
    }
    
    const submittedCount = submissionStatus.filter(s => s.isSubmitted).length;
    const allCompleted = submittedCount === submissionStatus.length && submissionStatus.length > 0;
    
    res.json({
      success: true,
      allCompleted,
      submittedCount,
      totalStudents: submissionStatus.length,
      completionPercentage: submissionStatus.length > 0 ? (submittedCount / submissionStatus.length) * 100 : 0,
      students: submissionStatus
    });
    
  } catch (error) {
    console.error("Error getting submission status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Auto-check and unlock Semester 2 when all Semester 1 grades are submitted
export const unlockSemester2 = async (req, res) => {
  try {
    const { courseId, academicYearId } = req.body;
    
    // Check if all students have submitted Semester 1
    const grades = await Grade.find({ 
      course: courseId,
      "academicYear._id": academicYearId 
    });
    
    const assignment = await TeacherAssignment.findOne({ 
      course: courseId,
      academicYear: academicYearId 
    }).populate('students');
    
    const allStudentIds = [];
    assignment.students.forEach(student => {
      allStudentIds.push(student._id.toString());
    });
    
    const submittedStudentIds = grades
      .filter(grade => grade.sem1?.locked === true)
      .map(grade => grade.student.toString());
    
    const allCompleted = allStudentIds.length > 0 && 
      allStudentIds.every(id => submittedStudentIds.includes(id));
    
    if (allCompleted) {
      // Update academic year to unlock semester 2
      await AcademicYear.findByIdAndUpdate(academicYearId, {
        $set: {
          "semesters.$[elem].isActive": true
        }
      }, {
        arrayFilters: [{ "elem.semester": 2 }]
      });
      
      res.json({
        success: true,
        message: "Semester 2 unlocked successfully",
        semester2Unlocked: true
      });
    } else {
      res.json({
        success: false,
        message: "Cannot unlock Semester 2. Not all Semester 1 grades are submitted.",
        submittedCount: submittedStudentIds.length,
        totalStudents: allStudentIds.length
      });
    }
    
  } catch (error) {
    console.error("Error unlocking semester 2:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student's released results
export const getStudentReleasedResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { academicYearId, semester } = req.query;
    const payload = await buildReleasedResultsPayload(studentId, semester, academicYearId);
    res.json({ success: true, ...payload });
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch results", 
      error: error.message 
    });
  }
};
// Get available academic years for student
export const getStudentAcademicYears = async (req, res) => {
  try {
    const studentId = req.user.id;
    const years = await getAcademicYearsForStudent(studentId);
    res.json({ success: true, academicYears: years });
  } catch (error) {
    console.error("Error fetching academic years:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch academic years", 
      error: error.message 
    });
  }
};

export const getParentReleasedResults = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { studentId, academicYearId, semester } = req.query;

    const student = await getParentAccessibleStudent(parentId, studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const payload = await buildReleasedResultsPayload(student._id, semester, academicYearId);
    res.json({ success: true, ...payload });
  } catch (error) {
    console.error("Error fetching parent released results:", error);
    res.status(500).json({ success: false, message: "Failed to fetch parent results", error: error.message });
  }
};

export const getParentAcademicYears = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { studentId } = req.query;

    const student = await getParentAccessibleStudent(parentId, studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const years = await getAcademicYearsForStudent(student._id);
    res.json({ success: true, academicYears: years });
  } catch (error) {
    console.error("Error fetching parent academic years:", error);
    res.status(500).json({ success: false, message: "Failed to fetch parent academic years", error: error.message });
  }
};
// Request grade review
export const requestGradeReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { gradeId, reason, courseName } = req.body;
    
    console.log("Review request for student:", studentId);
    console.log("Grade ID:", gradeId);
    console.log("Reason:", reason);
    
    // Find the grade
    const grade = await Grade.findOne({ 
      _id: gradeId, 
      student: studentId 
    }).populate('course', 'name');
    
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    
    // Create review request (you can create a ReviewRequest model or store in a separate collection)
    // For now, we'll just log it and return success
    // You can implement a ReviewRequest model later
    
    console.log(`Review request submitted for ${grade.course.name} by student ${studentId}`);
    console.log(`Reason: ${reason}`);
    
    // You can send an email notification to teacher/admin here
    
    res.json({
      success: true,
      message: "Review request submitted successfully. The teacher will review your request."
    });
    
  } catch (error) {
    console.error("Error requesting review:", error);
    res.status(500).json({ message: "Failed to submit review request", error: error.message });
  }
};
