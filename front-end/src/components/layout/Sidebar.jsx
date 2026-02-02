import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const commonLinks = [
  { to: "/profile", label: "My Profile", icon: "👤" },
];
  
  const adminLinks = [
    ...commonLinks,
    { to: "/admin", label: "Dashboard", icon: "📊" },
    { to: "/admin/students", label: "Students", icon: "👥" },
    { to: "/admin/teachers", label: "Teachers", icon: "👩‍🏫" },
    { to: "/admin/classes", label: "Classes", icon: "🏫" },
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
      ? teacherLinks:
       user?.role === "PARENT"
      ? parentLinks
      : user?.role === "STUDENT"
      ? studentLinks
      : "";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } pt-20 lg:pt-0`}
      >
        <div className="h-full px-6 py-8 overflow-y-auto">
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;