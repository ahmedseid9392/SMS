import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ← backend ONLY
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const user = JSON.parse(stored);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
