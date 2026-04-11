import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/react.svg";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, ChevronDown, User, Settings, Shield } from "lucide-react";

import defaultAvatar from "../../assets/images/hero.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const avatar = user?.profilePic || defaultAvatar;

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-lg transition-all duration-500 backdrop-blur-lg"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <img 
              src={logo} 
              alt="School Logo" 
              className="h-10 w-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" 
            />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold hidden sm:block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Green Valley High School
            </h1>
            <p className="text-xs opacity-60 hidden md:block">Management System</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 group focus:outline-none"
            >
              {/* Avatar with status indicator */}
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                  style={{ borderColor: "var(--border)" }}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2" 
                     style={{ borderColor: "var(--card)" }}></div>
              </div>
              
              {/* User Info */}
              <div className="text-left hidden md:block">
                <p className="font-semibold text-sm">{user?.name || "User"}</p>
                <p className="text-xs opacity-70 flex items-center gap-1">
                  <Shield size={12} />
                  {user?.role || "Guest"}
                </p>
              </div>
              
              <ChevronDown 
                size={16} 
                className={`hidden md:block transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div 
                  className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-slideDown z-50"
                  style={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="font-semibold text-sm">{user?.name || "User"}</p>
                    <p className="text-xs opacity-60">{user?.email || user?.role || "No email"}</p>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Navigate to profile if needed
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 hover:bg-opacity-10"
                      style={{ hover: { background: "var(--primary)" } }}
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Navigate to settings if needed
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200"
                      style={{ hover: { background: "var(--primary)" } }}
                    >
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </button>
                    
                    <div className="my-2 border-t" style={{ borderColor: "var(--border)" }}></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 transition-all duration-200 hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle with enhanced styling */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Logout Button (Mobile) */}
          <button
            onClick={handleLogout}
            className="sm:hidden px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Add animation styles to your global CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;