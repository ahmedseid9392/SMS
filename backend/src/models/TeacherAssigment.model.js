import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  classInfo: {
    grade: { type: Number, required: true },
    section: { type: String, required: true },
    stream: { type: String }
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ❌ Prevent same course having multiple teachers in same grade/section
TeacherAssignmentSchema.index(
  { grade: 1, section: 1, stream: 1, course: 1 },
  { unique: true }
);

export default mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
