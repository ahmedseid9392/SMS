import React from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/react.svg";
import defaultAvatar from "../../assets/images/hero.png"; // Add a placeholder image

const Navbar = () => {
  const { user, logout } = useAuth();

  const avatar = user?.profilePic || defaultAvatar;

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="School Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-xl font-bold hidden sm:block">
            Green Valley High School
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <img
              src={avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm opacity-90">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;