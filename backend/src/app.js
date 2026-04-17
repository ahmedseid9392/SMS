import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import studentRouter from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import teacherAssignmentRoutes from "./routes/TeacherAssigment.route.js";
import gradeRoutes from "./routes/Grade.routes.js"
import gradingSettingRoutes from "./routes/gradingSetting.routes.js"
import AcademicYearRoute from "./routes/academicYear.routes.js";
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", teacherAssignmentRoutes);
app.use("/api", gradeRoutes);
app.use("/api/grading-setting", gradingSettingRoutes);
app.use("/api/academic-years",AcademicYearRoute);
app.use('/api', notificationRoutes); 
app.use('/api', paymentRoutes);
// TEST ROUTE (IMPORTANT)
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

export default app;
