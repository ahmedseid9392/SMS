import AcademicYear from "../models/AcademicYear.model.js";
import GradingSetting from "../models/GradingSetting.model.js";

// Get all academic years
export const getAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find().sort({ createdAt: -1 });
    res.json({ success: true, data: academicYears });
  } catch (error) {
    console.error("Get academic years error:", error);
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
};

// Get single academic year
export const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;
    const academicYear = await AcademicYear.findById(id);
    
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    res.json({ success: true, data: academicYear });
  } catch (error) {
    console.error("Get academic year error:", error);
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
      semesters,
      status
    } = req.body;
    
    // Check if year already exists
    const existingYear = await AcademicYear.findOne({ name });
    if (existingYear) {
      return res.status(400).json({ message: "Academic year already exists" });
    }
    
    const academicYear = new AcademicYear({
      name,
      ethiopianYear,
      gregorianYear,
      calendar: calendar || 'EC',
      startDateEC,
      endDateEC,
      startDateGC,
      endDateGC,
      semesters: semesters || [
        { semester: 1, name: "First Semester", isActive: true },
        { semester: 2, name: "Second Semester", isActive: false }
      ],
      status: status || 'upcoming'
    });
    
    await academicYear.save();
    
    res.status(201).json({
      success: true,
      message: "Academic year created successfully",
      data: academicYear
    });
  } catch (error) {
    console.error("Create academic year error:", error);
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
    console.error("Update academic year error:", error);
    res.status(500).json({ message: "Failed to update academic year" });
  }
};

// Set active academic year
export const setActiveAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    
    // This will automatically deactivate others due to pre-save hook
    const academicYear = await AcademicYear.findById(id);
    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }
    
    academicYear.isActive = true;
    academicYear.status = 'active';
    await academicYear.save();
    
    res.json({
      success: true,
      message: "Academic year activated successfully",
      data: academicYear
    });
  } catch (error) {
    console.error("Set active academic year error:", error);
    res.status(500).json({ message: "Failed to set active academic year" });
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
    
    await AcademicYear.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: "Academic year deleted successfully"
    });
  } catch (error) {
    console.error("Delete academic year error:", error);
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
    
    academicYear.semesters[semesterIndex].isActive = !academicYear.semesters[semesterIndex].isActive;
    await academicYear.save();
    
    res.json({
      success: true,
      message: `Semester ${semester} ${academicYear.semesters[semesterIndex].isActive ? 'activated' : 'deactivated'}`,
      data: academicYear
    });
  } catch (error) {
    console.error("Toggle semester error:", error);
    res.status(500).json({ message: "Failed to toggle semester" });
  }
};

// ==================== GRADING SETTINGS ====================

// Get grading settings
export const getGradingSettings = async (req, res) => {
  try {
    let settings = await GradingSetting.findOne();
    if (!settings) {
      settings = new GradingSetting();
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get grading settings error:", error);
    res.status(500).json({ message: "Failed to fetch grading settings" });
  }
};

// Update grading settings
export const updateGradingSettings = async (req, res) => {
  try {
    const { midWeight, quizWeight, assignmentWeight, finalWeight } = req.body;
    
    // Validate total is 1 (100%)
    const total = midWeight + quizWeight + assignmentWeight + finalWeight;
    if (Math.abs(total - 1) > 0.01) {
      return res.status(400).json({ 
        message: "Weights must add up to 1 (100%)",
        currentTotal: total
      });
    }
    
    let settings = await GradingSetting.findOne();
    if (!settings) {
      settings = new GradingSetting();
    }
    
    settings.midWeight = midWeight;
    settings.quizWeight = quizWeight;
    settings.assignmentWeight = assignmentWeight;
    settings.finalWeight = finalWeight;
    await settings.save();
    
    res.json({
      success: true,
      message: "Grading settings updated successfully",
      data: settings
    });
  } catch (error) {
    console.error("Update grading settings error:", error);
    res.status(500).json({ message: "Failed to update grading settings" });
  }
};
// Get current active academic year
export const getCurrentAcademicYear = async (req, res) => {
  try {
    // Find the academic year that is active
    const currentYear = await AcademicYear.findOne({ isActive: true });
    
    if (!currentYear) {
      // If no active year found, get the most recent one
      const latestYear = await AcademicYear.findOne().sort({ createdAt: -1 });
      
      if (!latestYear) {
        return res.status(404).json({ 
          success: false, 
          message: "No academic year found" 
        });
      }
      
      return res.json({ 
        success: true, 
        data: latestYear,
        message: "No active year found, returning latest year"
      });
    }
    
    res.json({ 
      success: true, 
      data: currentYear 
    });
  } catch (error) {
    console.error("Get current academic year error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch current academic year" 
    });
  }
};