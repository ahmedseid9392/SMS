import api from "./axios"; // This already contains baseURL and axios instance

// CREATE STUDENT
export const createStudent = (data, token) => {
  return api.post("/students", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// GET ALL STUDENTS
export const getStudents = async (token, filters = {}) => {
  return api.get("/students", {
    headers: { Authorization: `Bearer ${token}` },
    params: filters
  });
};


// UPDATE STUDENT
export const updateStudent = (id, data, token) => {
  return api.put(`/students/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// GET STUDENT BY ID
export const getStudentById = (id, token) => {
  return api.get(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// DELETE STUDENT
export const deleteStudent = (id, token) => {
  return api.delete(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
