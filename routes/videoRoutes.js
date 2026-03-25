const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { authMiddleware } = require("../middleware/auth");

// GET /api/dashboard/videos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const videos = await Comment.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$videoId",
          videoTitle: { $first: "$videoTitle" },
          totalComments: { $sum: 1 },
          repliedComments: { $sum: { $cond: ["$replied", 1, 0] } },
          unrepliedComments: { $sum: { $cond: ["$replied", 0, 1] } },
          latestComment: { $max: "$createdAt" }
        }
      },
      { $sort: { latestComment: -1 } }
    ]);

    res.json(videos.map(v => ({
      videoId: v._id,
      videoTitle: v.videoTitle,
      totalComments: v.totalComments,
      repliedComments: v.repliedComments,
      unrepliedComments: v.unrepliedComments
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
