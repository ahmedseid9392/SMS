import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  mid: { type: Number, default: null },
  quiz: { type: Number, default: null },
  assignment: { type: Number, default: null },
  final: { type: Number, default: null },
  total: { type: Number, default: null },
  locked: { type: Boolean, default: false }
});

// Academic year reference schema
const AcademicYearRefSchema = new mongoose.Schema({
  year: { type: String, required: true },
  ethiopianYear: { type: String, required: true },
  gregorianYear: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, { _id: false });

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  
  // Academic Year Reference
  academicYear: AcademicYearRefSchema,
  
  // Draft grades (before submission)
  draft: {
    semester: { type: Number, enum: [1, 2] },
    mid: { type: Number, default: null },
    quiz: { type: Number, default: null },
    assignment: { type: Number, default: null },
    final: { type: Number, default: null },
    total: { type: Number, default: null },
    savedAt: { type: Date, default: Date.now }
  },

  sem1: { type: ScoreSchema, default: () => ({}) },
  sem2: { type: ScoreSchema, default: () => ({}) },

  sumSem1: { type: Number, default: 0 },
  sumSem2: { type: Number, default: 0 },
  finalSum: { type: Number, default: 0 },

  rankSem1: { type: Number, default: null },
  rankSem2: { type: Number, default: null },
  rankFinal: { type: Number, default: null },

  isTop3: { type: Boolean, default: false },
  top3Position: { type: Number, default: null },

  isReleased: { type: Boolean, default: false }
}, { timestamps: true });

// Compound index for unique grade per student per course per academic year
GradeSchema.index({ student: 1, course: 1, "academicYear.year": 1 }, { unique: true });

export default mongoose.model("Grade", GradeSchema);