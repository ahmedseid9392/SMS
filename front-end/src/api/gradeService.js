import api from "./axios"; // already handles baseURL & token

// Get grading settings (weights)
export const getGradingSetting = () => api.get("/grading-setting");

// Get assigned class students
export const getAssignedStudents = () => api.get("/teachers/assigned-classes");

// Submit grade
export const submitGrade = (payload) => api.post("/grades/submit", payload);

// Get teacher submitted grades
export const getTeacherGrades = () => api.get("/grades/teacher");

