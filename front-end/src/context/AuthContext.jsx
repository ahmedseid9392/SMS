import api from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore on refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // LOGIN
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });

      const fullUser = {
        ...res.data.user,
        token: res.data.token,  // IMPORTANT
      };

      // Save exactly how axios expects
      localStorage.setItem("user", JSON.stringify(fullUser));

      setUser(fullUser);
      return true;
    } catch (err) {
      console.error("LOGIN FAILED:", err);
      alert("Invalid username or password");
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
