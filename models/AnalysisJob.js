const mongoose = require("mongoose");

const analysisJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true, index: true },
  videoId: { type: String, required: true },
  videoUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "fetching_info", "fetching_comments", "classifying", "saving", "completed", "failed"],
    default: "pending",
  },
  progress: { type: Number, default: 0 },
  currentStep: { type: String, default: "Waiting to start..." },
  email: { type: String, default: null },
  emailSent: { type: Boolean, default: false },
  result: { type: mongoose.Schema.Types.ObjectId, ref: "AnalyzedVideo" },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL: 24 hours
});

module.exports = mongoose.model("AnalysisJob", analysisJobSchema);
