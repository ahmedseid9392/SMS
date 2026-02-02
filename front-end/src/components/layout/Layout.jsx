import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) return <Navigate to="/login" />;

  return (
    <div
      data-theme={theme}
      className="min-h-screen flex flex-col transition-all duration-500"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      <div className="flex flex-1">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main
          className="flex-1 p-6 overflow-y-auto transition-all duration-500"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            borderLeft: "1px solid var(--border)"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
