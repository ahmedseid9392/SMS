import api from "./axios"; // already handles baseURL & token


// Academic Year APIs
export const getCurrentAcademicYear = async () => {
  const response = await api.get("/academic-years/current");
  return response.data;
};

export const getAllAcademicYears = async () => {
  const response = await api.get("/academic-years/all");
  return response.data;
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

// Submit grade
export const saveGradeDraft = async (data) => {
  const response = await api.post("/grades/draft", data);
  return response.data;
};

// Updated grade APIs with academic year
export const submitFinalGrade = async (data) => {
  const response = await api.post("/grades/submit", data);
  return response.data;
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


// ───────────────────────────────────────────────
// Admin APIs
// ───────────────────────────────────────────────

export const getAllGrades = async () => {
  const res = await api.get("/grades/all");
  return res.data; // ✅ return data directly
};

export const adminComputeSemesterTotals = () =>
  api.post("/grades/compute-totals");

export const adminComputeRanking = () =>
  api.post("/grades/compute-ranking");

export const adminComputeTop3 = () =>
  api.post("/grades/top3");

export const adminReleaseGrades = () =>
  api.post("/grades/release");

export const adminUnlockGrade = (gradeId) =>
  api.patch(`/grades/unlock/${gradeId}`);






