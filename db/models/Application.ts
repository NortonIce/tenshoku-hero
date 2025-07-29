import mongoose from "mongoose";

const applicationStepSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "Applied",
        "Recieved Take Home Assignment",
        "Sent Take Home Assignment",
        "Interview",
        "Offer",
        "Rejected",
        "Ignored",
      ],
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

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
    required: false,
  },
  steps: [applicationStepSchema],
  resume: {
    type: String,
    required: false,
  },
  coverLetter: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  recruiter: {
    type: String,
    required: false,
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
});

// Update the updatedAt timestamp before saving
applicationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
