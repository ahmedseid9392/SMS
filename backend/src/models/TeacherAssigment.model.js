import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema(
  {
    grade: {
      type: Number,
      required: true,
      enum: [9, 10, 11, 12]
    },

    section: {
      type: String,
      required: true
    },

    stream: {
      type: String,
      enum: ["Natural", "Social", "None"],
      default: "None"
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    }
  },
  { timestamps: true }
);

// ❌ Prevent same course having multiple teachers in same grade/section
TeacherAssignmentSchema.index(
  { grade: 1, section: 1, stream: 1, course: 1 },
  { unique: true }
);

export default mongoose.model("TeacherAssignment", TeacherAssignmentSchema);
