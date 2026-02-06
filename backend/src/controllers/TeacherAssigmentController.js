import TeacherAssignment from "../models/TeacherAssigment.model.js";
import Course from "../models/Courses.js";
import Teacher from "../models/Teacher.model.js";

export const assignTeacher = async (req, res) => {
  try {
    const { grade, section, stream, course, teacher } = req.body;

    if (!grade || !section || !course || !teacher) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check assignment exists
    const courseExists = await Course.findById(course);
    if (!courseExists)
      return res.status(404).json({ message: "Course not found" });

    // Check teacher exists
    const teacherExists = await Teacher.findById(teacher);
    if (!teacherExists)
      return res.status(404).json({ message: "Teacher not found" });

    // Check if assignment already exists
    const duplicate = await TeacherAssignment.findOne({
      grade,
      section,
      stream: stream || "None",
      course
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "This assignment already has a teacher in this section" });
    }

    // Create assignment
    const Assignment = await TeacherAssignment.create({
      grade,
      section,
      stream: stream || "None",
      course,
      teacher
    });

    res.status(201).json({ message: "Teacher assigned successfully", Assignment });

  } catch (err) {
    console.error("Assign Teacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { grade, section, stream } = req.query;

    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (stream) filter.stream = stream;

    const list = await TeacherAssignment.find(filter)
      .populate("teacher", "fullName subject")
      .populate("course", "name gradeLevel stream");

    res.status(200).json(list);

  } catch (err) {
    console.error("Get Assignments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findById(req.params.id)
      .populate("teacher")
      .populate("course");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error("Get Assignment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { teacher, course, grade, section, stream } = req.body;

    if (!teacher || !course) {
      return res
        .status(400)
        .json({ message: "Teacher and Course are required" });
    }

    if ((grade == 11 || grade == 12) && !stream) {
      return res
        .status(400)
        .json({ message: "Stream is required for grade 11 & 12" });
    }

    const updatedAssignment = await TeacherAssignment.findByIdAndUpdate(
      req.params.id,
      {
        teacher,
        course,
        grade,
        section,
        stream: stream || "None",
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ assignment: updatedAssignment });
  } catch (error) {
    console.error("Update Assignment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await TeacherAssignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment removed" });
  } catch (err) {
    console.error("Delete Assignment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
