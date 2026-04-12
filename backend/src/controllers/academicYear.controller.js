import AcademicYear from "../models/AcademicYear.model.js";

// Get all academic years
export const getAcademicYears = async (req, res) => {
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

// Get current active academic year
export const getCurrentAcademicYear = async (req, res) => {
  try {
    let academicYear = await AcademicYear.findOne({ isActive: true, status: 'active' });
    
    if (!academicYear) {
      // Create default academic year if none exists
      await AcademicYear.createDefaultYears();
      academicYear = await AcademicYear.findOne({ isActive: true, status: 'active' });
    }
    
    res.json({
      success: true,
      data: academicYear
    });
  } catch (error) {
    console.error("Error fetching current academic year:", error);
    res.status(500).json({ message: "Failed to fetch current academic year" });
  }
};

// Get academic year by ID
export const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.findById(id);
    
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
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

// Create academic year
export const createAcademicYear = async (req, res) => {
  try {
    const {
      name,
      ethiopianYear,
      gregorianYear,
      calendar,
      startDateEC,
      endDateEC,
      startDateGC,
      endDateGC,
      semesters
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
      semesters
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

// Update academic year
export const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const academicYear = await AcademicYear.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
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

// Delete academic year
export const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.findByIdAndDelete(id);
    
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    res.json({
      success: true,
      message: "Academic year deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting academic year:", error);
    res.status(500).json({ message: "Failed to delete academic year" });
  }
};

// Toggle semester active status
export const toggleSemester = async (req, res) => {
  try {
    const { id, semester } = req.params;
    
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    const semesterIndex = academicYear.semesters.findIndex(s => s.semester === parseInt(semester));
    if (semesterIndex === -1) {
      return res.status(404).json({ message: "Semester not found" });
    }
    
    // Toggle the semester active status
    academicYear.semesters[semesterIndex].isActive = !academicYear.semesters[semesterIndex].isActive;
    await academicYear.save();
    
    res.json({
      success: true,
      message: `Semester ${semester} ${academicYear.semesters[semesterIndex].isActive ? 'activated' : 'deactivated'}`,
      data: academicYear
    });
  } catch (error) {
    console.error("Error toggling semester:", error);
    res.status(500).json({ message: "Failed to toggle semester" });
  }
};