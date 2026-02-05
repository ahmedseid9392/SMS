

import api from "./axios";   

// Get all assignments
export const getAssignments = async () => {
  const res = await api.get("/assignments");
  return res.data; // expected: { assignments: [...] }
};

// Get single assignment by ID
export const getAssignmentById = async (id) => {
  const res = await api.get(`/assignments/${id}`);
  return res; // expected: { assignment: {...} }
};

// Create new assignment
export const createAssignment = async (payload) => {
  const res = await api.post("/assignments", payload);
  return res.data; // expected: { assignment: {...} }
};

// Update assignment
export const updateAssignment = async (id, payload) => {
  const res = await api.put(`/assignments/${id}`, payload);
  return res;
};

// Delete assignment
export const deleteAssignment = async (id) => {
  const res = await api.delete(`/assignments/${id}`);
  return res;
};
