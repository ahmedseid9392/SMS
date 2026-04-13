import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true,
      trim: true 
    },
    phone: { 
      type: String,
      trim: true 
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    address: {
      type: String,
      trim: true
    },
    qualification: {
      type: String,
      enum: ["Bachelor's Degree", "Master's Degree", "PhD", "Diploma", "Other"],
      required: true
    },
    specialization: {
      type: String,
      trim: true
    },
    subjects: [{
      type: String,
      required: true
    }],
    gradeLevels: [{
      type: Number,
      enum: [9, 10, 11, 12],
      required: true
    }],
    stream: {
      type: String,
      enum: ["Natural", "Social", "Both", "None"],
      default: "None"
    },
    experience: {
      years: { type: Number, default: 0 },
      previousSchool: { type: String }
    },
    username: { 
      type: String, 
      unique: true,
      required: true
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      default: "TEACHER",
      enum: ["TEACHER", "HEAD_TEACHER", "SUBJECT_COORDINATOR"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Generate username before saving
teacherSchema.pre('save', function(next) {
  if (!this.username) {
    // Generate username from full name
    const nameParts = this.fullName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    this.username = `${firstName}.${lastName}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model("Teacher", teacherSchema);