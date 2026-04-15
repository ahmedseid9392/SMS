import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // GVS2018011
      immutable: true, // ❗ username cannot be changed
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      required: true,
    },

    grade: String,
    section: String,
    courses: [String],

    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isFirstLogin: {
      type: Boolean,
      default: true, // force password change
    },
     notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    gradeAlerts: { type: Boolean, default: true },
    attendanceAlerts: { type: Boolean, default: true },
    assignmentAlerts: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: false }
  },
  profilePicture: { type: String, default: "" }
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
