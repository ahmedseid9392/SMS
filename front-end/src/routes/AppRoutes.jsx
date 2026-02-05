import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../landing-pages/Landing";
import Login from "../landing-pages/auth/Login";

import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teacher";
import Courses from "../pages/admin/Courses";
import StudentFormModal from "../components/students/StudentFormModal"
import TeacherForm from "../components/teachers/TeacherForm"
import CourseFormModal from "../components/courses/CourseFormModal"
import AssignmentForm from "../components/Assignment/AssignmentForm"
import  TeacherAssignment from "../pages/admin/TeacherAssignment"

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
  path="/admin/teachers"
  element={
    <ProtectedRoute>
      <Teachers/>
    </ProtectedRoute>
  }
/>
     <Route
  path="/admin/courses"
  element={
    <ProtectedRoute>
      <Courses/>
    </ProtectedRoute>
  }
/>
     <Route
  path="/admin/assignment"
  element={
    <ProtectedRoute>
     < TeacherAssignment/>
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
<Route
  path="/admin/teachers/add"
  element={
    <ProtectedRoute>
      <TeacherForm />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/teachers/edit/:id"
  element={
    <ProtectedRoute>
      <TeacherForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/courses/add"
  element={
    <ProtectedRoute>
      <CourseFormModal/>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/courses/edit/:id"
  element={
    <ProtectedRoute>
     <CourseFormModal/>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/assignment/add"
  element={
    <ProtectedRoute>
      <AssignmentForm/>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/assignment/edit/:id"
  element={
    <ProtectedRoute>
     <AssignmentForm/>
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
