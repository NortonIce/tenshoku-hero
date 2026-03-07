import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  relatedApplications: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Application",
    default: [],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  pomodoroCount: {
    type: Number,
    default: 0,
  },
  completedPomodoros: {
    type: Number,
    default: 0,
  },
  experiencePoints: {
    type: Number,
    default: 0,
  },
});

taskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
