import api from "./axios";

// GET all courses
export const getCourses = async () => {
  return api.get("/courses");
};

// GET single course by ID
export const getCourseById = async (id) => {
  return api.get(`/courses/${id}`);
};

// CREATE course
export const createCourse = async (courseData) => {
  return api.post("/courses", courseData);
};

// UPDATE course
export const updateCourse = async (id, courseData) => {
  return api.put(`/courses/${id}`, courseData);
};

// DELETE course
export const deleteCourse = async (id) => {
  return api.delete(`/courses/${id}`);
};
