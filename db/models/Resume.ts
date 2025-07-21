import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  applications: {
    type: Map,
    of: Number,
    default: () => new Map(),
  },
  isPrefferd: {
    type: Boolean,
    default: false,
    required: false,
  },
});

// Update the updatedAt timestamp before saving
resumeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
