const Comment = require("../models/Comment");
const { createYoutubeClient } = require("../services/youtubeClientFactory");
const fetchComments = require("../services/fetchComments");
const autoReply = require("../services/autoReply");

// GET /api/dashboard/comments
exports.getComments = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.videoId) filter.videoId = req.query.videoId;
    if (req.query.replied === "true") filter.replied = true;
    if (req.query.replied === "false") filter.replied = false;

    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/dashboard/comments/reply
exports.postManualReply = async (req, res) => {
  const { commentId, text } = req.body;

  if (!commentId || !text) {
    return res.status(400).json({ error: "commentId and text are required" });
  }

  try {
    const comment = await Comment.findOne({ userId: req.user._id, commentId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const { youtube } = createYoutubeClient(req.user.refreshToken);
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
    comment.commentReply = text;
    await comment.save();

    res.json({ message: "Reply posted successfully", commentId, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/dashboard/comments/trigger
exports.triggerJob = async (req, res) => {
  try {
    const user = req.user;
    if (!user.refreshToken || !user.channelId) {
      return res.status(400).json({ error: "YouTube channel not connected" });
    }

    const { youtube } = createYoutubeClient(user.refreshToken);
    await fetchComments(youtube, user._id.toString(), user.channelId);
    await autoReply(youtube, user._id.toString(), user.aiPromptTemplate, {
      autoReplyMode: user.autoReplyMode,
      autoReplyVideoIds: user.autoReplyVideoIds,
    });

    res.json({ message: "Job executed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
