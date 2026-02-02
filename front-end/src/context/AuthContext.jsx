import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      setUser(data);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.message || "Invalid login"
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
