import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    grade: Number,
    section: String,
    stream: String
  },
  { timestamps: true }
);

export default mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
