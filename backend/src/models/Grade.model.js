import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  mid: { type: Number, default: null },
  quiz: { type: Number, default: null },
  assignment: { type: Number, default: null },
  final: { type: Number, default: null },
  total: { type: Number, default: null },
  locked: { type: Boolean, default: false },
  submittedAt: Date,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const DraftSchema = new mongoose.Schema({
  semester: { type: Number },
  mid: { type: Number, default: 0 },
  quiz: { type: Number, default: 0 },
  assignment: { type: Number, default: 0 },
  final: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  savedAt: Date
});

const AcademicYearInfoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  year: { type: String },
  ethiopianYear: { type: String },
  gregorianYear: { type: String }
}, { _id: false });

const GradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  // Make academicYear completely optional - remove required
  academicYear: { 
    type: AcademicYearInfoSchema,
    default: null,
    required: false 
  },

  sem1: { type: ScoreSchema, default: () => ({}) },
  sem2: { type: ScoreSchema, default: () => ({}) },
  
  draft: { type: DraftSchema, default: null },

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

export default mongoose.model("Grade", GradeSchema);