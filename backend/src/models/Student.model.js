import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },
    role: { type: String, default: "STUDENT" },
    grade: { type: Number, required: true },
    section: { type: String, required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      default: null,
    },
    stream: {
      type: String,
      enum: ["Natural", "Social"],
      required: function () {
        return this.grade === 11 || this.grade === 12;
      },
    },
   courses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
],

    mustChangePassword: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
