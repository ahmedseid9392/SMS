import api from "./axios";

// GET teachers
export const getTeachers = (token, params = {}) =>
  api.get("/teachers", {
    headers: { Authorization: `Bearer ${token}` },
    params
  });

// GET by ID
export const getTeacherById = async (id, token) => {
  try {
    const response = await api.get(`/teachers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Get teacher by ID error:", error);
    throw error;
  }
};

// CREATE teacher
export const createTeacher = (data, token) =>
  api.post("/teachers/register", data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// UPDATE teacher
export const updateTeacher = (id, data, token) =>
  api.put(`/teachers/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// DELETE teacher
export const deleteTeacher = (id, token) =>
  api.delete(`/teachers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
