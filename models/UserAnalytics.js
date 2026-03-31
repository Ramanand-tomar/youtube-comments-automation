const mongoose = require("mongoose");

const userAnalyticsSchema = new mongoose.Schema({
  userIdentifier: { type: String, required: true },
  identifierType: { type: String, enum: ["user", "ip"], required: true },
  videoId: { type: String, required: true },
  analyzedVideo: { type: mongoose.Schema.Types.ObjectId, ref: "AnalyzedVideo", default: null },
  analyzedAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
});

userAnalyticsSchema.index({ userIdentifier: 1, identifierType: 1, videoId: 1 }, { unique: true });
userAnalyticsSchema.index({ userIdentifier: 1, identifierType: 1, analyzedAt: -1 });

module.exports = mongoose.model("UserAnalytics", userAnalyticsSchema);
