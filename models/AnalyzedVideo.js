const mongoose = require("mongoose");

const analyzedVideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true, index: true },
  videoInfo: {
    title: String,
    channelTitle: String,
    thumbnail: String,
    publishedAt: Date,
    viewCount: Number,
    likeCount: Number,
    commentCount: Number,
  },
  comments: [{
    author: String,
    text: String,
    publishedAt: Date,
    likeCount: Number,
    categories: [String],
  }],
  summary: {
    suggestion: { type: Number, default: 0 },
    appreciation: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    success_story: { type: Number, default: 0 },
    query: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  totalFetched: Number,
  analyzedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AnalyzedVideo", analyzedVideoSchema);
