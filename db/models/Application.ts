import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  jobSite: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Take home assignment', 'Interview', 'Rejected', 'Offer'],
  },
  applicationDate: {
    type: Date,
    required: true,
  },
  resume: {
    type: String,
    required: false,
  },
  coverLetter: {
    type: String,
    required: false,
  },
  recruiter: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema); 