import api from "./axios"; // your baseURL axios instance

// Get classes + students assigned to the teacher
export const getAssignedClasses = async () => {
  const response = await api.get("/teachers/assigned-classes");
  return response.data;
};
