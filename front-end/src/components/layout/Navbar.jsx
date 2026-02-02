import React from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/react.svg";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { FiLogOut } from "react-icons/fi";

import defaultAvatar from "../../assets/images/hero.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const avatar = user?.profilePic || defaultAvatar;

  return (
    <header
      className="shadow-lg transition"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="School Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-xl font-bold hidden sm:block">Green Valley High School</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <img
              src={avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 shadow"
              style={{ borderColor: "var(--border)" }}
            />
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm opacity-80">{user?.role}</p>
            </div>
          </div>

          <ThemeToggle />

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition"
            style={{
              background: "var(--bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
