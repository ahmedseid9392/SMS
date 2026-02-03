import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },

    username: { type: String, unique: true },
    password: { type: String, required: true },

    role: { type: String, default: "TEACHER" },
    mustChangePassword: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
