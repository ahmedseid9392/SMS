import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  semester: { type: Number, required: true },

  scores: {
    mid: { type: Number, default: null },
    quiz: { type: Number, default: null },
    assignment: { type: Number, default: null },
    final: { type: Number, default: null },
    total: { type: Number, default: null },
  },

  status: { type: String, default: null }, // null until submit
  locked: { type: Boolean, default: false }, // false for drafts

}, { timestamps: true });

export default mongoose.model("Grade", GradeSchema);
