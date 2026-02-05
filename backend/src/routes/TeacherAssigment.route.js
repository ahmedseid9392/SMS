import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  assignTeacher,
  getAssignments,
  deleteAssignment,
   getAssignmentById,
  updateAssignment
} from "../controllers/TeacherAssigmentController.js";

const router = express.Router();

router.post("/", protect, assignTeacher);
router.get("/", protect, getAssignments);
router.delete("/:id", protect, deleteAssignment);
router.get("/:id", protect, getAssignmentById);
router.put("/:id", protect, updateAssignment);

export default router;
