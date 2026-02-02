import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    fullName: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },

    role: { type: String, default: "PARENT" },

    // Parent may have multiple children
    children: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        name: String,
        grade: Number,
        section: String
      }
    ],

    mustChangePassword: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);
