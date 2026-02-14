import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  scores: {
    sem1: {
      mid: Number,
      quiz: Number,
      assignment: Number,
      final: Number,
      total: Number,
      locked: { type: Boolean, default: false },
      status: { type: String, default: null }
    },
    sem2: {
      mid: Number,
      quiz: Number,
      assignment: Number,
      final: Number,
      total: Number,
      locked: { type: Boolean, default: false },
      status: { type: String, default: null }
    }
  },

  average: { type: Number, default: null }

}, { timestamps: true });

export default mongoose.model("Grade", GradeSchema);

