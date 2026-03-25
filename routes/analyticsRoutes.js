const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

// GET /api/dashboard/analytics?days=7
router.get("/", async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const userId = req.user._id;

    // ── 1. Replies over time (grouped by day) ──
    const repliesOverTime = await Comment.aggregate([
      {
        $match: {
          userId,
          replied: true,
          updatedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
          replies: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          day: "$_id",
          replies: 1,
        },
      },
    ]);

    // ── 2. Comment volume trends (total + replied per day) ──
    const commentVolume = await Comment.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: 1 },
          replied: {
            $sum: { $cond: [{ $eq: ["$replied", true] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          day: "$_id",
          total: 1,
          replied: 1,
        },
      },
    ]);

    // ── 3. Top commenters ──
    const topCommenters = await Comment.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: "$author",
          comments: { $sum: 1 },
        },
      },
      { $sort: { comments: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          comments: 1,
        },
      },
    ]);

    // ── 4. Summary stats ──
    const totalComments = await Comment.countDocuments({
      userId,
      createdAt: { $gte: since },
    });
    const totalReplied = await Comment.countDocuments({
      userId,
      replied: true,
      updatedAt: { $gte: since },
    });

    // Average response time: diff between updatedAt (reply time) and createdAt (comment time)
    const avgResponseAgg = await Comment.aggregate([
      {
        $match: {
          userId,
          replied: true,
          updatedAt: { $gte: since },
        },
      },
      {
        $project: {
          diffMs: { $subtract: ["$updatedAt", "$createdAt"] },
        },
      },
      {
        $group: {
          _id: null,
          avgMs: { $avg: "$diffMs" },
        },
      },
    ]);

    const avgResponseMs = avgResponseAgg.length > 0 ? avgResponseAgg[0].avgMs : 0;
    const avgResponseMin = Math.round((avgResponseMs / 60000) * 10) / 10; // 1 decimal

    res.json({
      repliesOverTime,
      commentVolume,
      topCommenters,
      stats: {
        totalComments,
        totalReplied,
        replyRate: totalComments > 0 ? Math.round((totalReplied / totalComments) * 100) : 0,
        avgResponseMin,
      },
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;
