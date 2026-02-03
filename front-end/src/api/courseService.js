import api from "./axios";

// GET all courses
export const getCourses = (token) => {
  return api.get("/courses", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET by ID
export const getCourseById = (id, token) => {
  return api.get(`/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// REGISTER course
export const createCourse = (courseData, token) => {
  return api.post("/courses/register", courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE course
export const updateCourse = (id, courseData, token) => {
  return api.put(`/courses/${id}`, courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// DELETE course
export const deleteCourse = (id, token) => {
  return api.delete(`/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
