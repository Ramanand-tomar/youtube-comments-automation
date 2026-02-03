const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: String,
  videoId: String,
  text: String,
  author: String,
  replied: { type: Boolean, default: false },
  createdAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
