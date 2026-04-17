import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
//import logo from "../../assets/react.svg";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { LogOut, ChevronDown, User, Settings, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../ui/NotificationBell";
import defaultAvatar from "../../assets/images/hero.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
   const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const avatar = user?.
profilePicture || defaultAvatar;

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };
    const handleNavigate = (path) => {
    navigate(path);
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
              src="" 
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
          {/* Notification Bell */}
          <NotificationBell />

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 group focus:outline-none"
            >
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                  style={{ borderColor: "var(--border)" }}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2" 
                     style={{ borderColor: "var(--card)" }}></div>
              </div>
              
              <div className="text-left hidden md:block">
                <p className="font-semibold text-sm">{user?.name || user?.fullName || "User"}</p>
                <p className="text-xs opacity-70 flex items-center gap-1">
                  <Shield size={12} />
                  {user?.role || "Guest"}
                </p>
              </div>
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
                    <p className="font-semibold text-sm">{user?.name || user?.fullName || "User"}</p>
                    <p className="text-xs opacity-60">{user?.email || user?.role || "No email"}</p>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={() => handleNavigate("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigate("/admin/profile-settings")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </button>
                    
                    <div className="my-2 border-t" style={{ borderColor: "var(--border)" }}></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
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