import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const commonLinks = [{ to: "/profile", label: "My Profile", icon: "👤" }];

  const adminLinks = [
    ...commonLinks,
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/students", label: "Students", icon: "👥" },
    { to: "/admin/teachers", label: "Teachers", icon: "👩‍🏫" },
    { to: "/admin/courses", label: "Courses", icon: "👩‍🏫" },
    { to: "/admin/assignment", label: "Teacher Assignment", icon: "👩‍🏫" },
    { to: "/admin/classes", label: "Classes", icon: "🏫" },
    { to: "/admin/grades", label: "Grade", icon: "🏫" },
  ];

  const teacherLinks = [
    ...commonLinks,
    { to: "/teacher", label: "Dashboard", icon: "📊" },
    { to: "/teacher/classes", label: "My Classes", icon: "📚" },
    { to: "/teacher/attendance", label: "Attendance", icon: "✅" },
    { to: "/teacher/grades", label: "Grades", icon: "📝" },
  ];

  const studentLinks = [
    ...commonLinks,
    { to: "/student", label: "Dashboard", icon: "📊" },
    { to: "/student/results", label: "Results", icon: "🏆" },
    { to: "/student/assignments", label: "Assignments", icon: "📄" },
    { to: "/student/timetable", label: "Timetable", icon: "🕒" },
  ];

  const parentLinks = [
    ...commonLinks,
    { to: "/parent", label: "Dashboard", icon: "📊" },
    { to: "/parent/results", label: "Results", icon: "🏆" },
    { to: "/parent/assignments", label: "Assignments", icon: "📄" },
    { to: "/parent/attendance", label: "Attendance", icon: "✅" },
    { to: "/parent/notifications", label: "Notifications", icon: "🔔" },
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
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-3 rounded-xl shadow-lg"
        style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--card)",
          color: "var(--text)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div className="h-full px-6 py-8 overflow-y-auto">
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all transform ${
                    isActive
                      ? "scale-[1.02]"
                      : "hover:scale-[1.01]"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "var(--primary)" : "var(--bg)",
                  color: isActive ? "#fff" : "var(--text)",
                  border: "1px solid var(--border)",
                })}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
        />
      )}
    </>
  );
};

export default Sidebar;
