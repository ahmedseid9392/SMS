import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../landing-pages/Landing";
import Login from "../landing-pages/auth/Login";

import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import StudentFormModal from "../components/students/StudentFormModal"

import TeacherDashboard from "../pages/teacher/Dashboard";
import Attendance from "../pages/teacher/Attendance";
import Grades from "../pages/teacher/Grades";

import StudentDashboard from "../pages/student/Dashboard";
import Results from "../pages/student/Results";
import Assignments from "../pages/student/Assignments";
import Notifications from "../pages/student/Notifications";
import AttendanceView from "../pages/student/Attendance";

import ParentDashboard from "../pages/parent/Dashboard";
import Profile from "../pages/Profile";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
     <Route
  path="/admin/students"
  element={
    <ProtectedRoute>
      <Students />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/students/add"
  element={
    <ProtectedRoute>
      <StudentFormModal />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/students/edit/:id"
  element={
    <ProtectedRoute>
      <StudentFormModal />
    </ProtectedRoute>
  }
/>

      

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/grades"
        element={
          <ProtectedRoute>
            <Grades />
          </ProtectedRoute>
        }
      />

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute>
            <AttendanceView />
          </ProtectedRoute>
        }
      />

      {/* Parent */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Common */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
