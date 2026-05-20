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
        background: "transparent",
        color: "var(--text)",
      }}
    >
      {/* NAVBAR - fixed at top */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <div className="flex flex-1 relative">
        {/* SIDEBAR - starts below navbar with proper positioning */}
        <div className="relative z-30">
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        <main
          className="flex-1 overflow-y-auto transition-all duration-500 min-h-[calc(100vh-80px)]"
          style={{
            background: "transparent",
            color: "var(--text)",
          }}
        >
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 xl:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
