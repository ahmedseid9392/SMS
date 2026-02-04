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
  }
 
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
