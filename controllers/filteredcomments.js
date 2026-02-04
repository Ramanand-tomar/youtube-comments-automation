const Comment = require("../models/Comment");

// @desc    Get all filtered comments
// @route   GET /api/comments/filtered
exports.getFilteredComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// create a function that can fetch comments from youtube and store in databse 
// @desc    Fetch comments from YouTube
// @route   GET /api/comments/fetch
exports.fetchCommentsFromYoutube = async (req, res, youtube) => {
    try {
        const comments = await youtube.commentThreads.list({
            part: "snippet",
            allThreadsRelatedToChannelId: process.env.CHANNEL_ID,
            maxResults: 50,
            order: "time"
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



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
    comment.commentReply = text;
    await comment.save();

    res.status(200).json({ message: "Manual reply posted successfully", commentId, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
