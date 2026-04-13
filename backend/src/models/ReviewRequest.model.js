// models/ReviewRequest.model.js
import mongoose from 'mongoose';

const reviewRequestSchema = new mongoose.Schema({
  grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: String,
  respondedAt: Date
}, { timestamps: true });

export default mongoose.model('ReviewRequest', reviewRequestSchema);