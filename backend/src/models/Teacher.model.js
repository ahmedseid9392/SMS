import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "TEACHER" },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
