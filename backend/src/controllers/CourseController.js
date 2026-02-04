import Course from "../models/Courses.js";

// ======================= CREATE COURSE ============================
export const createCourse = async (req, res) => {
  try {
    const { name, gradeLevel, stream } = req.body;

    if (!name || !gradeLevel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Grade 11/12 require stream
    if ((gradeLevel == 11 || gradeLevel == 12) && !stream) {
      return res
        .status(400)
        .json({ message: "Stream is required for grade 11 & 12" });
    }

    const course = await Course.create({
      name,
      gradeLevel,
      stream: stream || "None",
    });

    res.status(201).json({ course });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET ALL COURSES ============================
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json(courses );
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET COURSE BY ID ============================
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= UPDATE COURSE ============================
export const updateCourse = async (req, res) => {
  try {
    const { name, gradeLevel, stream } = req.body;

    // Grade 11/12 require stream
    if ((gradeLevel == 11 || gradeLevel == 12) && !stream) {
      return res
        .status(400)
        .json({ message: "Stream is required for grade 11 & 12" });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      {
        name,
        gradeLevel,
        stream: stream || "None",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course: updated });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= DELETE COURSE ============================
export const deleteCourse = async (req, res) => {
  try {
    const removed = await Course.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
