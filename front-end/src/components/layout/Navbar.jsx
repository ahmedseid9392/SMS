import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import { LogOut, User, Settings, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../ui/NotificationBell";
import defaultAvatar from "../../assets/images/hero.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const avatar = user?.profilePicture || defaultAvatar;

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
    <header className="sticky top-0 z-50 transition-all duration-500">
      <div className="mx-auto max-w-[1600px] px-4 pt-3 md:px-6 xl:px-8">
        <div className="glass-panel flex items-center justify-between rounded-[1.6rem] px-4 py-3 md:px-6">
          <div className="flex cursor-pointer items-center gap-4 group" onClick={() => navigate("/")}>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--primary), #0ea5e9)" }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="section-title hidden text-lg font-semibold sm:block">
                Green Valley High School
              </h1>
              <p className="text-muted hidden text-xs md:block">Professional school operations hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <NotificationBell />

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="glass-panel flex items-center gap-3 rounded-full px-2 py-1.5 group focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 object-cover shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <div
                    className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-green-500"
                    style={{ borderColor: "var(--card)" }}
                  ></div>
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold">{user?.name || user?.fullName || "User"}</p>
                  <p className="text-muted flex items-center gap-1 text-xs">
                    <Shield size={12} />
                    {user?.role || "Guest"}
                  </p>
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="glass-panel animate-slideDown absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl">
                    <div className="border-b p-3" style={{ borderColor: "var(--border)" }}>
                      <p className="text-sm font-semibold">{user?.name || user?.fullName || "User"}</p>
                      <p className="text-muted text-xs">{user?.email || user?.role || "No email"}</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => handleNavigate("/profile")}
                        className="w-full px-4 py-2 text-left text-sm transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <span className="flex items-center gap-3">
                          <User size={16} />
                          <span>My Profile</span>
                        </span>
                      </button>

                      <button
                        onClick={() => handleNavigate("/admin/profile-settings")}
                        className="w-full px-4 py-2 text-left text-sm transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <span className="flex items-center gap-3">
                          <Settings size={16} />
                          <span>Account Settings</span>
                        </span>
                      </button>

                      <div className="my-2 border-t" style={{ borderColor: "var(--border)" }}></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm transition-all duration-200 hover:bg-red-500/10"
                        style={{ color: "var(--danger)" }}
                      >
                        <span className="flex items-center gap-3">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
