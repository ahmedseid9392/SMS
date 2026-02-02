import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    fullName: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },

    role: { type: String, default: "TEACHER" },

    subject: { type: String, required: true },
    gradeLevels: [Number], // Example: [9, 10, 11]

    mustChangePassword: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
