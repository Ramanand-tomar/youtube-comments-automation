const express = require("express");
const router = express.Router();
const parseVideoId = require("../services/videoIdParser");
const { fetchVideoComments, fetchVideoInfo } = require("../services/fetchVideoComments");
const classifyComments = require("../services/classifyComments");
const AnalyzedVideo = require("../models/AnalyzedVideo");

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return next();
  }

  if (entry.count >= RATE_LIMIT) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  entry.count++;
  return next();
}

// Cleanup stale entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > WINDOW_MS) rateLimitMap.delete(ip);
  }
}, 30 * 60 * 1000);

// Helper: group classified comments by category (multi-category: comment appears in each)
function groupByCategory(comments) {
  const categories = {
    suggestion: [],
    appreciation: [],
    negative: [],
    success_story: [],
    query: [],
  };
  for (const comment of comments) {
    for (const cat of comment.categories) {
      if (categories[cat]) {
        categories[cat].push(comment);
      }
    }
  }
  return categories;
}

router.post("/analyze", rateLimit, async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(503).json({ error: "YouTube API key not configured." });
    }

    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: "videoUrl is required." });
    }

    const videoId = parseVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube video URL." });
    }

    // Check DB cache first
    const cached = await AnalyzedVideo.findOne({ videoId });
    if (cached) {
      // Backfill videoInfo for old cached entries that don't have it
      let videoInfo = cached.videoInfo;
      if (!videoInfo || !videoInfo.title) {
        videoInfo = await fetchVideoInfo(videoId);
        if (videoInfo.title) {
          cached.videoInfo = videoInfo;
          await cached.save();
        }
      }
      return res.json({
        videoId: cached.videoId,
        videoInfo: videoInfo || {},
        totalFetched: cached.totalFetched,
        summary: cached.summary,
        categories: groupByCategory(cached.comments),
        cached: true,
      });
    }

    // Fetch comments from YouTube
    const { comments, totalFetched, videoInfo } = await fetchVideoComments(videoId);

    if (comments.length === 0) {
      return res.status(404).json({ error: "No comments found. Comments may be disabled for this video." });
    }

    // Classify with Gemini AI
    const { classified, summary } = await classifyComments(comments);

    // Save to DB for future lookups
    await AnalyzedVideo.create({
      videoId,
      videoInfo,
      comments: classified,
      summary,
      totalFetched,
      analyzedAt: new Date(),
    });

    res.json({
      videoId,
      videoInfo,
      totalFetched,
      summary,
      categories: groupByCategory(classified),
      cached: false,
    });
  } catch (err) {
    console.error("Analyze error:", err.message);

    if (err.message?.includes("commentsDisabled")) {
      return res.status(404).json({ error: "Comments are disabled for this video." });
    }
    if (err.code === 403 || err.message?.includes("forbidden")) {
      return res.status(403).json({ error: "Cannot access this video. It may be private or restricted." });
    }

    res.status(500).json({ error: "Failed to analyze video. Please try again." });
  }
});

router.delete("/analyze/:videoId", rateLimit, async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ error: "videoId is required." });
    }

    const result = await AnalyzedVideo.findOneAndDelete({ videoId });
    if (!result) {
      return res.status(404).json({ error: "No cached analysis found for this video." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete analysis error:", err.message);
    res.status(500).json({ error: "Failed to delete analysis." });
  }
});

module.exports = router;
