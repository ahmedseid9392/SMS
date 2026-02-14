import api from "./axios"; // already handles baseURL & token

// Get grading settings (weights)
export const getGradingSetting = () => api.get("/grading-setting");

// Get assigned class students
export const getAssignedStudents = () => api.get("/teachers/assigned-classes");

// Submit grade
export const saveGradeDraft = (data) => {
  return api.post("/grades/save", data);
};

export const submitFinalGrade = (data) => {
  return api.post("/grades/submit", data);
};

// export  default gradeRecord=(data)=>{
//   return api.get("/grades/all", data)
// }

// Get teacher submitted grades
export const getTeacherGrades = () => api.get("/grades/teacher");

export const getGradesForClass = async (classId) => {
  const res = await api.get(`/grades/class/${classId}`);
  return res.data.grades;
};

export const getSemesterTotals = async (studentId, courseId) => {
  const res = await api.get(`/grades/semester-totals/${studentId}/${courseId}`);
  return res.data;
};



