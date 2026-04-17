import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/student.controller.js";

const router = express.Router();

// LIST + CREATE
router.get("/", protect, getStudents);
router.post("/", protect, createStudent);

// SINGLE STUDENT CRUD
router.get("/:id", protect, getStudentById);
router.put("/:id", protect, updateStudent);
router.delete("/:id", protect, deleteStudent);


export default router;
