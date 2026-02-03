import api from "../api/axios";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 RESTORE USER SESSION ON PAGE REFRESH
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser({
        ...JSON.parse(userData),
        token: token,
      });
    }
  }, []);

  // 🔥 LOGIN FUNCTION
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });

      // Save token + user to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 FIX: include token inside user state
      setUser({
        ...res.data.user,
        token: res.data.token,
      });

      return true;
    } catch (error) {
      alert("Invalid username or password");
      return false;
    }
  };

  // 🔥 LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
