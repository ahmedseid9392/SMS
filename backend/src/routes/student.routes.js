import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createStudent, getStudents, getStudentById } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/", protect, getStudents);
router.post("/", protect, createStudent);
router.get("/:id", protect, getStudentById);



export default router;
