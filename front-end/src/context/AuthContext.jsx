import api from "../api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Restore on refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // LOGIN
  const login = async (username, password) => {
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Logging in...");
    
    try {
      const res = await api.post("/auth/login", { username, password });

      const fullUser = {
        ...res.data.user,
        token: res.data.token,
      };

      // Save exactly how axios expects
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${fullUser.name || username}!`, {
        duration: 3000,
        icon: '🎉',
        style: {
          background: 'var(--card)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        },
      });
      
      return true;
      
    } catch (err) {
      console.error("LOGIN FAILED:", err);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Handle different error cases
      let errorMessage = "Invalid username or password";
      
      if (err.response) {
        // Server responded with error status
        switch (err.response.status) {
          case 401:
            errorMessage = "Invalid username or password";
            break;
          case 404:
            errorMessage = "Server not found. Please check your connection.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = err.response.data?.message || "Login failed. Please try again.";
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Cannot connect to server. Please check your network.";
      } else {
        // Something else happened
        errorMessage = err.message || "An error occurred. Please try again.";
      }
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        icon: '❌',
        style: {
          background: 'var(--card)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        },
      });
      
      return false;
      
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully", {
      duration: 2000,
      icon: '👋',
      style: {
        background: 'var(--card)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};