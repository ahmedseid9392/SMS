import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.model.js";
import TeacherAssignment from "../models/TeacherAssigment.model.js"
import Student from "../models/Student.model.js"
const generateTeacherUsername = async () => {
  const count = await Teacher.countDocuments();
  return `GVS2024${String(count + 1).padStart(3, "0")}`;
};


// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      address,
      qualification,
      specialization,
      subjects,
      gradeLevels,
      stream,
      experience,
      password
    } = req.body;

    // Validate required fields
    if (!fullName || !subjects || !gradeLevels || !qualification || !password) {
      return res.status(400).json({ 
        message: "Missing required fields: fullName, subjects, gradeLevels, qualification, password" 
      });
    }

    // Validate grade levels
    const validGrades = [9, 10, 11, 12];
    const invalidGrades = gradeLevels.filter(grade => !validGrades.includes(grade));
    if (invalidGrades.length > 0) {
      return res.status(400).json({ 
        message: `Invalid grade levels: ${invalidGrades.join(', ')}. Valid grades are 9, 10, 11, 12` 
      });
    }

    // Validate stream based on grade levels
    if (gradeLevels.includes(11) || gradeLevels.includes(12)) {
      if (!stream || stream === "None") {
        return res.status(400).json({ 
          message: "Stream is required for grades 11 and 12" 
        });
      }
    }

    // Generate username
    const nameParts = fullName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    let username = `${firstName}.${lastName}`;
    
    // Check if username exists and make it unique
    let existingTeacher = await Teacher.findOne({ username });
    let counter = 1;
    while (existingTeacher) {
      username = `${firstName}.${lastName}${counter}`;
      existingTeacher = await Teacher.findOne({ username });
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    const teacher = new Teacher({
      fullName,
      phone,
      email,
      address,
      qualification,
      specialization,
      subjects,
      gradeLevels,
      stream: stream || "None",
      experience,
      username,
      password: hashedPassword
    });

    await teacher.save();

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: teacherResponse
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    res.status(500).json({ message: "Failed to create teacher", error: error.message });
  }
};

// Get all teachers with filters
export const getTeachers = async (req, res) => {
  try {
    const { name, subject, grade, stream, qualification } = req.query;
    
    let filter = {};
    
    if (name) {
      filter.fullName = { $regex: name, $options: 'i' };
    }
    if (subject) {
      filter.subjects = { $in: [new RegExp(subject, 'i')] };
    }
    if (grade) {
      filter.gradeLevels = parseInt(grade);
    }
    if (stream && stream !== 'All') {
      filter.stream = stream;
    }
    if (qualification) {
      filter.qualification = qualification;
    }
    
    const teachers = await Teacher.find(filter).select('-password');
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers
    });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    console.error("Get teacher error:", error);
    res.status(500).json({ message: "Failed to fetch teacher", error: error.message });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      address,
      qualification,
      specialization,
      subjects,
      gradeLevels,
      stream,
      experience,
      isActive,
      role
    } = req.body;

    // Validate grade levels if provided
    if (gradeLevels) {
      const validGrades = [9, 10, 11, 12];
      const invalidGrades = gradeLevels.filter(grade => !validGrades.includes(grade));
      if (invalidGrades.length > 0) {
        return res.status(400).json({ 
          message: `Invalid grade levels: ${invalidGrades.join(', ')}` 
        });
      }
    }

    // Validate stream based on grade levels
    if (gradeLevels && (gradeLevels.includes(11) || gradeLevels.includes(12))) {
      if (!stream || stream === "None") {
        return res.status(400).json({ 
          message: "Stream is required for grades 11 and 12" 
        });
      }
    }

    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update fields
    if (fullName) teacher.fullName = fullName;
    if (phone) teacher.phone = phone;
    if (email) teacher.email = email;
    if (address) teacher.address = address;
    if (qualification) teacher.qualification = qualification;
    if (specialization) teacher.specialization = specialization;
    if (subjects) teacher.subjects = subjects;
    if (gradeLevels) teacher.gradeLevels = gradeLevels;
    if (stream) teacher.stream = stream;
    if (experience) teacher.experience = experience;
    if (typeof isActive !== 'undefined') teacher.isActive = isActive;
    if (role) teacher.role = role;

    await teacher.save();

    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: teacherResponse
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    res.status(500).json({ message: "Failed to update teacher", error: error.message });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    await teacher.deleteOne();
    
    res.status(200).json({
      message: "Teacher deleted successfully"
    });
  } catch (error) {
    console.error("Delete teacher error:", error);
    res.status(500).json({ message: "Failed to delete teacher", error: error.message });
  }
};

// Get teachers by subject
export const getTeachersBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    
    const teachers = await Teacher.find({ 
      subjects: { $in: [new RegExp(subject, 'i')] },
      isActive: true 
    }).select('-password');
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers
    });
  } catch (error) {
    console.error("Get teachers by subject error:", error);
    res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
  }
};

// Get teachers by grade
export const getTeachersByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    
    const teachers = await Teacher.find({ 
      gradeLevels: parseInt(grade),
      isActive: true 
    }).select('-password');
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers
    });
  } catch (error) {
    console.error("Get teachers by grade error:", error);
    res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
  }
};


export const getAssignedClassesAndStudents = async (req, res) => {
  try {
    const teacherId = req.user.id; // FIXED

    const assignments = await TeacherAssignment.find({ teacher: teacherId })
      .populate("course", "name gradeLevel stream") // course._id is also available
      .lean();

    const results = [];

   for (const a of assignments) {
  let query = {
    grade: Number(a.grade),
    section: a.section,
  };

  // Only match stream for grade 11 & 12
  if (a.grade === 11 || a.grade === 12) {
    query.stream = a.stream;
  }

  const students = await Student.find(query).lean();

  results.push({
    classInfo: {
      grade: a.grade,
      section: a.section,
      stream: a.stream,
      course: a.course?.name,
      courseId: a.course?._id,
    },
    students,
  });
}


    res.status(200).json(results);

  } catch (err) {
    console.error("Assigned Class Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
