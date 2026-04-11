import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Menu, X, User, LayoutDashboard, Users, School, BookOpen, UserCheck, GraduationCap, Calendar, ClipboardList, Clock, Bell, Award, FileText } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const commonLinks = [
    { to: "/profile", label: "My Profile", icon: User, color: "from-blue-500 to-cyan-500" }
  ];

  const adminLinks = [
    ...commonLinks,
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
    { to: "/admin/students", label: "Students", icon: Users, color: "from-green-500 to-emerald-500" },
    { to: "/admin/teachers", label: "Teachers", icon: School, color: "from-orange-500 to-red-500" },
    { to: "/admin/courses", label: "Courses", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
    { to: "/admin/assignment", label: "Teacher Assignment", icon: UserCheck, color: "from-teal-500 to-cyan-500" },
    { to: "/admin/classes", label: "Classes", icon: GraduationCap, color: "from-yellow-500 to-orange-500" },
    { to: "/admin/grades", label: "Grade", icon: ClipboardList, color: "from-red-500 to-pink-500" },
  ];

  const teacherLinks = [
    ...commonLinks,
    { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
    { to: "/teacher/classes", label: "My Classes", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
    { to: "/teacher/attendance", label: "Attendance", icon: Calendar, color: "from-green-500 to-emerald-500" },
    { to: "/teacher/grades", label: "Grades", icon: Award, color: "from-yellow-500 to-orange-500" },
  ];

  const studentLinks = [
    ...commonLinks,
    { to: "/student", label: "Dashboard", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
    { to: "/student/results", label: "Results", icon: Award, color: "from-yellow-500 to-orange-500" },
    { to: "/student/assignments", label: "Assignments", icon: FileText, color: "from-blue-500 to-indigo-500" },
    { to: "/student/timetable", label: "Timetable", icon: Clock, color: "from-green-500 to-emerald-500" },
  ];

  const parentLinks = [
    ...commonLinks,
    { to: "/parent", label: "Dashboard", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
    { to: "/parent/results", label: "Results", icon: Award, color: "from-yellow-500 to-orange-500" },
    { to: "/parent/assignments", label: "Assignments", icon: FileText, color: "from-blue-500 to-indigo-500" },
    { to: "/parent/attendance", label: "Attendance", icon: Calendar, color: "from-green-500 to-emerald-500" },
    { to: "/parent/notifications", label: "Notifications", icon: Bell, color: "from-red-500 to-pink-500" },
  ];

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "TEACHER"
      ? teacherLinks
      : user?.role === "PARENT"
      ? parentLinks
      : studentLinks;

  return (
    <>
      {/* Toggle button for mobile - positioned below navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-lg"
        style={{ 
          background: "var(--card)", 
          color: "var(--text)", 
          border: "1px solid var(--border)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
        }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar - positioned with top margin to clear navbar */}
      <aside
        className={`fixed top-[73px] left-0 bottom-0 z-40 w-72 transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:top-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--card)",
          color: "var(--text)",
          borderRight: "1px solid var(--border)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)",
          height: "calc(100vh - 73px)", // Adjust height to account for navbar
        }}
      >
        <div className="h-full px-5 py-6 overflow-y-auto">
          {/* User Profile Summary */}
          <div className="mb-8 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.charAt(0) || user?.role?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-xs opacity-60 truncate">{user?.role || "Guest"}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "shadow-lg scale-[1.02]"
                      : "hover:scale-[1.02] hover:shadow-md"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "var(--primary)" : "var(--bg)",
                  color: isActive ? "#fff" : "var(--text)",
                  border: "1px solid var(--border)",
                })}
              >
                <div 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    !link.icon ? "" : "group-hover:scale-110"
                  }`}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <link.icon 
                    size={18} 
                    className="transition-all duration-300"
                    style={{ color: "currentColor" }}
                  />
                </div>
                
                <span className="font-medium text-sm">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer note */}
          <div className="absolute bottom-6 left-5 right-5">
            <div 
              className="p-3 rounded-lg text-center text-xs opacity-50"
              style={{ border: "1px solid var(--border)" }}
            >
              <p>Green Valley School</p>
              <p className="text-[10px] mt-1">v2.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay - Smooth fade animation */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 lg:hidden animate-fadeIn"
          style={{ 
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            top: "73px", // Start overlay below navbar
          }}
        />
      )}
    </>
  );
};

export default Sidebar;