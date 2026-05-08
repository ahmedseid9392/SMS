import api from "./axios"; // already handles baseURL & token


// Academic Year APIs
export const getCurrentAcademicYear = async () => {
  const response = await api.get("/academic-years/current");
  return response.data;
};

export const getAcademicYears = async () => {
  try {
    const response = await api.get('/academic-years');
    // Ensure we always return an array
    let years = [];
    if (response.data && Array.isArray(response.data)) {
      years = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      years = response.data.data;
    } else if (Array.isArray(response)) {
      years = response;
    }
    return { data: years };
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return { data: [] };
  }
};
export const createAcademicYear = async (data) => {
  const response = await api.post("/academic-years/create", data);
  return response.data;
};

export const setActiveAcademicYear = async (id) => {
  const response = await api.put(`/academic-years/set-active/${id}`);
  return response.data;
};

export const updateSemesterStatus = async (academicYearId, semester, isActive) => {
  const response = await api.put("/academic-years/semester-status", {
    academicYearId,
    semester,
    isActive
  });
  return response.data;
};
// Get grading settings (weights)
export const getGradingSetting = () => api.get("/grading-setting");

// Get assigned class students
export const getAssignedStudents = () => api.get("/teachers/assigned-classes");

// Save grade draft
export const saveGradeDraft = async (data) => {
  try {
    console.log("Saving draft:", data);
    const response = await api.post('/grades/draft', data);
    return response.data;
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
};

// Submit final grade
export const submitFinalGrade = async (data) => {
  try {
    console.log("Submitting grade:", data);
    const response = await api.post('/grades/submit', data);
    return response.data;
  } catch (error) {
    console.error("Error submitting grade:", error);
    throw error;
  }
};

// export  default gradeRecord=(data)=>{
//   return api.get("/grades/all", data)
// }

// Get teacher submitted grades
export const getTeacherGrades = () => api.get("/grades/teacher");

export const getGradesForClass = async (courseId, academicYearId = null) => {
  const params = academicYearId ? { academicYearId } : {};
  const response = await api.get(`/grades/class/${courseId}`, { params });
  return response.data.grades;
};

export const getSemesterTotals = async (studentId, courseId, academicYearId = null) => {
  const params = academicYearId ? { academicYearId } : {};
  const response = await api.get(`/grades/semester-totals/${studentId}/${courseId}`, { params });
  return response.data;
}



// Check if all students have submitted Semester 1
export const checkSemester1Completion = async (courseId, academicYearId) => {
  try {
    const response = await api.get(`/grades/semester1-completion/${courseId}`, {
      params: { academicYearId }
    });
    return response;
  } catch (error) {
    console.error("Error checking semester 1 completion:", error);
    // Return a default response instead of throwing
    return {
      data: {
        success: false,
        allCompleted: false,
        completedCount: 0,
        totalStudents: 0,
        completionPercentage: 0
      }
    };
  }
};;

// Get detailed submission status
export const getSemester1SubmissionStatus = async (courseId, academicYearId) => {
  try {
    const response = await api.get(`/grades/semester1-status/${courseId}`, {
      params: { academicYearId }
    });
    return response;
  } catch (error) {
    console.error("Error getting submission status:", error);
    throw error;
  }
};

// Manually unlock semester 2 (admin only)
export const unlockSemester2 = async (courseId, academicYearId) => {
  try {
    const response = await api.post('/grades/unlock-semester2', {
      courseId,
      academicYearId
    });
    return response;
  } catch (error) {
    console.error("Error unlocking semester 2:", error);
    throw error;
  }
};


// ───────────────────────────────────────────────
// Admin APIs
// ───────────────────────────────────────────────

export const getAllGrades = async (academicYearId) => {
  try {
    const response = await api.get('/grades/all', {
      params: { academicYearId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all grades:", error);
    throw error;
  }
};

export const adminComputeSemesterTotals = () =>
  api.post("/grades/compute-totals");

export const adminComputeRanking = () =>
  api.post("/grades/compute-ranking");

export const adminComputeTop3 = () =>
  api.post("/grades/top3");

export const adminReleaseGrades = async (sectionKey, academicYearId) => {
  try {
    const response = await api.post('/grades/release', { 
      sectionKey, 
      academicYearId 
    });
    return response;
  } catch (error) {
    console.error("Error releasing grades:", error);
    throw error;
  }
};


export const adminUnlockGrade = (gradeId) =>
  api.patch(`/grades/unlock/${gradeId}`);




// Get student's released results
export const getStudentReleasedResults = async (academicYearId, semester) => {
  try {
    const response = await api.get('/student/results', {
      params: { academicYearId, semester }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};

// Get available academic years for student
export const getStudentAcademicYears = async () => {
  try {
   const response = await api.get('/student/results/academic-years');
    return response.data;
  } catch (error) {
    console.error("Error fetching academic years:", error);
    throw error;
  }
};

// Request grade review
export const requestGradeReview = async (gradeId, reason) => {
  try {
    const response = await api.post('/student/results/request-review', {
      gradeId,
      reason
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting grade review:", error);
    throw error;
  }
};


