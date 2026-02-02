import api from "./axios";

export const createStudent = async (data) => {
  return api.post("auth/students", data);
};

export const getStudentById = async (id) => {
  return api.get(`/students/${id}`);
};

export const updateStudent = async (id, data) => {
  return api.put(`/students/${id}`, data);
};

export const deleteStudent = async (id) => {
  return api.delete(`/students/${id}`);
};

export const getStudents = async () => {
  return api.get("/students");
};
