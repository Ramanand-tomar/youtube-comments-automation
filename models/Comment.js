const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  commentId: String,
  videoId: String,
  videoTitle: String,
  text: String,
  author: String,
  replied: { type: Boolean, default: false },
  commentReply: String,
  createdAt: Date
}, { timestamps: true });

commentSchema.index({ userId: 1, commentId: 1 }, { unique: true });

module.exports = mongoose.model("Comment", commentSchema);
