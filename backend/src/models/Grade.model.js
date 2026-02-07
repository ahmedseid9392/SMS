import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  semester: { type: Number, enum: [1, 2], required: true },

  scores: {
    mid: Number,
    quiz: Number,
    assignment: Number,
    final: Number,
  },

  total: Number,   // Auto calculated for that semester (100%)
  yearTotal: Number,  // When both semesters exist
  status: { type: String, enum: ["PASS", "FAIL"] },

  locked: { type: Boolean, default: true } // Teacher cannot edit after submit
}, { timestamps: true });

export default mongoose.model("Grade", gradeSchema);
