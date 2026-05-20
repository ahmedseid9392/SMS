import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Users,
  CreditCard,
  School,
  BookOpen,
  UserCheck,
  GraduationCap,
  Calendar,
  ClipboardList,
  Clock,
  Award,
  FileText,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const commonLinks = [{ to: "/profile", label: "My Profile", icon: User }];

  const adminLinks = [
    ...commonLinks,
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/students", label: "Students", icon: Users },
    { to: "/admin/teachers", label: "Teachers", icon: School },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/assignment", label: "Teacher Assignment", icon: UserCheck },
    { to: "/admin/classes", label: "Classes", icon: GraduationCap },
    { to: "/admin/grades", label: "Grade", icon: ClipboardList },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/academic-years", label: "Academic Years", icon: Calendar },
  ];

  const teacherLinks = [
    ...commonLinks,
    { to: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { to: "/teacher/classes", label: "My Classes", icon: BookOpen },
    { to: "/teacher/attendance", label: "Attendance", icon: Calendar },
    { to: "/teacher/grades", label: "Grades", icon: Award },
  ];

  const studentLinks = [
    ...commonLinks,
    { to: "/student", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/results", label: "Results", icon: Award },
    { to: "/student/assignments", label: "Assignments", icon: FileText },
    { to: "/student/timetable", label: "Timetable", icon: Clock },
    { to: "/student/payments", label: "Payments", icon: CreditCard },
  ];

  const parentLinks = [
    ...commonLinks,
    { to: "/parent", label: "Dashboard", icon: LayoutDashboard },
    { to: "/parent/results", label: "Results", icon: Award },
    { to: "/parent/notifications", label: "Notifications", icon: FileText },
    { to: "/parent/payments", label: "Payments", icon: CreditCard },
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel fixed left-4 top-24 z-50 rounded-2xl p-3 transition-all duration-300 hover:scale-105 lg:hidden"
        style={{ color: "var(--text)" }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <aside
        className={`fixed bottom-0 left-0 z-40 w-72 transition-all duration-500 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          color: "var(--text)",
          top: "88px",
          height: "calc(100vh - 96px)",
        }}
      >
        <div className="glass-panel mx-4 flex h-full flex-col overflow-hidden rounded-[1.8rem]">
          <div className="flex-shrink-0 border-b px-5 pb-4 pt-6" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--primary), #0ea5e9)" }}
              >
                {user?.name?.charAt(0) || user?.role?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{user?.name || "User"}</p>
                <p className="text-muted truncate text-xs">{user?.role || "Guest"}</p>
              </div>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            <nav className="space-y-2.5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                      isActive ? "scale-[1.01] shadow-lg" : "hover:translate-x-1"
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? "linear-gradient(135deg, var(--primary), #0ea5e9)" : "rgba(255,255,255,0)",
                    color: isActive ? "#fff" : "var(--text)",
                    border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  })}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <link.icon size={18} style={{ color: "currentColor" }} />
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto flex-shrink-0 border-t px-5 pb-6 pt-4" style={{ borderColor: "var(--border)" }}>
            <div
              className="rounded-2xl p-4 text-center text-xs transition-all duration-300 hover:opacity-100"
              style={{ border: "1px solid var(--border)", background: "var(--bg-soft)", color: "var(--text-muted)" }}
            >
              <p>Green Valley School</p>
              <p className="mt-1 text-[10px]">v2.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 animate-fadeIn lg:hidden"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            top: "88px",
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
