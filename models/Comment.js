const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: String,
  videoId: String,
  videoTitle: String,
  text: String,
  author: String,
  replied: { type: Boolean, default: false },
  commentReply: String,
  createdAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
