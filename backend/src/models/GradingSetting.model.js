import mongoose from "mongoose";

const gradingSettingSchema = new mongoose.Schema({
  midWeight: { type: Number, default: 0.15 },
  quizWeight: { type: Number, default: 0.10 },
  assignmentWeight: { type: Number, default: 0.25 },
  finalWeight: { type: Number, default: 0.50 },
}, { timestamps: true });

export default mongoose.model("GradingSetting", gradingSettingSchema);
