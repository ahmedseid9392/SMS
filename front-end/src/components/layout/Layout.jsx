import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-6 lg:ml-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;