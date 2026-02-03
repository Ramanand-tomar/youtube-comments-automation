const Comment = require("../models/Comment");

// @desc    Get all fetched comments
// @route   GET /api/comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all replied comments
// @route   GET /api/comments/replied
exports.getRepliedComments = async (req, res) => {
  try {
    const comments = await Comment.find({ replied: true }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Post a manual reply to a comment
// @route   POST /api/comments/reply
exports.postManualReply = async (req, res, youtube) => {
  const { commentId, text } = req.body;

  if (!commentId || !text) {
    return res.status(400).json({ error: "commentId and text are required" });
  }

  try {
    const comment = await Comment.findOne({ commentId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found in database" });
    }

    await youtube.comments.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          parentId: commentId,
          textOriginal: text
        }
      }
    });

    comment.replied = true;
    await comment.save();

    res.status(200).json({ message: "Manual reply posted successfully", commentId, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
