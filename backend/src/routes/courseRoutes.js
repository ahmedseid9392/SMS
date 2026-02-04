import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/CourseController.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// All course routes require login
router.post("/", protect, createCourse);
router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

export default router;
