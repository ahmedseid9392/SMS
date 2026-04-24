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
import  GradeDashboard from "../pages/admin/GradeDashboard"

import TeacherDashboard from "../pages/teacher/Dashboard";
import Attendance from "../pages/teacher/Attendance";
import GradeSubmission from "../pages/teacher/GradeSubmission";
import Classes from "../pages/teacher/Classes";

import StudentDashboard from "../pages/student/Dashboard";
import StudentResults from "../pages/student/StudentResults";
import Assignments from "../pages/student/Assignments";
import Notifications from "../pages/student/Notifications";
import AttendanceView from "../pages/student/Attendance";

import ParentDashboard from "../pages/parent/Dashboard";
import ProfileSettings from "../pages/admin/ProfileSettings";
import Profile from "../pages/Profile";
import AcademicYearManagement from "../pages/admin/AcademicYearManagement";

import StudentPayments from "../pages/student/StudentPayments";
import ParentPayments from "../pages/parent/ParentPayments";
import AdminPayments from "../pages/admin/AdminPayments";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import MockPaymentSuccess from "../pages/MockPaymentSuccess";
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
  path="/admin/grades"
  element={
    <ProtectedRoute>
     < GradeDashboard/>
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

  <Route path="/admin/profile-settings" element={<ProfileSettings />} />
  <Route path="/profile" element={<ProfileSettings />} />    
<Route path="/admin/academic-years" element={<AcademicYearManagement />} />
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
            <GradeSubmission/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute>
            < Classes />
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
           <StudentResults />
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
      <Route path="/student/payments" element={<StudentPayments />} />
    <Route path="/parent/payments" element={<ParentPayments />}/>
    <Route path="/admin/payments" element={<AdminPayments />} />
    <Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/failed" element={<PaymentFailed />} />
<Route path="/mock-payment" element={<MockPaymentSuccess />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
