import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // Ethiopian year format: 2017 EC
  ethiopianYear: {
    type: String,
    required: true,
    match: /^\d{4}\s*EC$/i
  },
  // Gregorian year format: 2024/25
  gregorianYear: {
    type: String,
    required: true
  },
  calendar: {
    type: String,
    enum: ['EC', 'GC', 'BOTH'],
    default: 'EC'
  },
  startDateEC: Date,
  endDateEC: Date,
  startDateGC: Date,
  endDateGC: Date,
  isActive: {
    type: Boolean,
    default: false
  },
  semesters: [{
    semester: { type: Number, enum: [1, 2] },
    name: String,
    startDateEC: Date,
    endDateEC: Date,
    startDateGC: Date,
    endDateGC: Date,
    isActive: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'archived'],
    default: 'upcoming'
  }
}, { timestamps: true });

// Ensure only one active academic year
academicYearSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false, status: 'completed' }
    );
  }
  next();
});

export default mongoose.model("AcademicYear", academicYearSchema);