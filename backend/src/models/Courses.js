import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gradeLevel: {
    type: Number,
    required: true,
  },
  stream: {
    type: String,
    enum: ["Natural", "Social", "None"],
    default: "None",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
