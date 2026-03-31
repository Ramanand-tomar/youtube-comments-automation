const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const parseVideoId = require("../services/videoIdParser");
const { fetchVideoInfo } = require("../services/fetchVideoComments");
const AnalyzedVideo = require("../models/AnalyzedVideo");
const AnalysisJob = require("../models/AnalysisJob");
const UserAnalytics = require("../models/UserAnalytics");
const processAnalysisJob = require("../services/processAnalysisJob");
const { optionalAuth, getUserIdentity } = require("../middleware/optionalAuth");

// Apply optional auth to all routes
router.use(optionalAuth);

// Simple in-memory rate limiter (abuse prevention — separate from daily business limit)
const rateLimitMap = new Map();
const RATE_LIMIT = 30;
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

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > WINDOW_MS) rateLimitMap.delete(ip);
  }
}, 30 * 60 * 1000);

const DAILY_LIMIT = 1;

function getStartOfDayUTC() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getResetTime() {
  const d = getStartOfDayUTC();
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

async function getDailyUsage(userIdentifier, identifierType) {
  return UserAnalytics.countDocuments({
    userIdentifier,
    identifierType,
    analyzedAt: { $gte: getStartOfDayUTC() },
  });
}

// Helper: group classified comments by category
function groupByCategory(comments) {
  const categories = {
    suggestion: [],
    appreciation: [],
    negative: [],
    success_story: [],
    query: [],
    irrelevant: [],
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

// Helper: build full result response from AnalyzedVideo document
function buildResultResponse(doc) {
  const summary = { ...doc.summary };
  if (summary.irrelevant == null) {
    const irrelevantComments = (doc.comments || []).filter(
      (c) => c.categories && c.categories.length === 1 && c.categories[0] === "irrelevant"
    );
    summary.irrelevant = irrelevantComments.length;
  }

  return {
    videoId: doc.videoId,
    videoInfo: doc.videoInfo || {},
    totalFetched: doc.totalFetched,
    summary,
    categories: groupByCategory(doc.comments),
  };
}

// ─── POST /analyze ───────────────────────────────────────────────────────────
router.post("/analyze", rateLimit, async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(503).json({ error: "YouTube API key not configured." });
    }

    const { videoUrl, email } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: "videoUrl is required." });
    }

    const videoId = parseVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube video URL." });
    }

    const { userIdentifier, identifierType } = getUserIdentity(req);

    // 1. Check if THIS USER already analyzed this video
    const userEntry = await UserAnalytics.findOne({ userIdentifier, identifierType, videoId });
    if (userEntry) {
      // User has seen this before — return cached result (no daily limit consumed)
      const cached = await AnalyzedVideo.findOne({ videoId });
      if (cached) {
        // Backfill videoInfo for old entries
        if (!cached.videoInfo || !cached.videoInfo.title) {
          const videoInfo = await fetchVideoInfo(videoId);
          if (videoInfo.title) {
            cached.videoInfo = videoInfo;
            await cached.save();
          }
        }
        userEntry.lastAccessedAt = new Date();
        await userEntry.save();
        return res.json({ cached: true, ...buildResultResponse(cached) });
      }

      // UserAnalytics exists but AnalyzedVideo was deleted (dangling ref) — check for in-progress job
      const inProgressJob = await AnalysisJob.findOne({
        videoId,
        status: { $nin: ["completed", "failed"] },
      });
      if (inProgressJob) {
        return res.json({
          jobId: inProgressJob.jobId,
          status: inProgressJob.status,
          progress: inProgressJob.progress,
          currentStep: inProgressJob.currentStep,
          message: "Analysis already in progress for this video.",
        });
      }

      // Dangling ref — remove stale entry so user can re-analyze
      await UserAnalytics.deleteOne({ _id: userEntry._id });
    }

    // 2. Check global cache (another user may have analyzed this video)
    const globalCached = await AnalyzedVideo.findOne({ videoId });
    if (globalCached) {
      if (!globalCached.videoInfo || !globalCached.videoInfo.title) {
        const videoInfo = await fetchVideoInfo(videoId);
        if (videoInfo.title) {
          globalCached.videoInfo = videoInfo;
          await globalCached.save();
        }
      }
      // Create UserAnalytics entry — no daily limit consumed (no API calls needed)
      await UserAnalytics.create({
        userIdentifier,
        identifierType,
        videoId,
        analyzedVideo: globalCached._id,
        analyzedAt: new Date(),
        lastAccessedAt: new Date(),
      });
      return res.json({ cached: true, ...buildResultResponse(globalCached) });
    }

    // 3. Check daily limit (only for NEW analyses that require API calls)
    const todayUsage = await getDailyUsage(userIdentifier, identifierType);
    if (todayUsage >= DAILY_LIMIT) {
      return res.status(429).json({
        error: "Daily analysis limit reached. You can analyze 1 new video per day.",
        dailyLimit: {
          used: todayUsage,
          max: DAILY_LIMIT,
          canAnalyze: false,
          resetsAt: getResetTime(),
        },
      });
    }

    // 4. Check for existing in-progress job
    const existingJob = await AnalysisJob.findOne({
      videoId,
      status: { $nin: ["completed", "failed"] },
    });
    if (existingJob) {
      if (email && !existingJob.email) {
        existingJob.email = email;
        await existingJob.save();
      }
      // Create UserAnalytics entry (counts against daily limit)
      await UserAnalytics.findOneAndUpdate(
        { userIdentifier, identifierType, videoId },
        { analyzedAt: new Date(), lastAccessedAt: new Date(), analyzedVideo: null },
        { upsert: true }
      );
      return res.json({
        jobId: existingJob.jobId,
        status: existingJob.status,
        progress: existingJob.progress,
        currentStep: existingJob.currentStep,
        message: "Analysis already in progress for this video.",
      });
    }

    // 5. Create new job + UserAnalytics entry
    const jobId = crypto.randomUUID();
    await AnalysisJob.create({
      jobId,
      videoId,
      videoUrl,
      email: email || null,
    });

    await UserAnalytics.create({
      userIdentifier,
      identifierType,
      videoId,
      analyzedVideo: null,
      analyzedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    processAnalysisJob(jobId).catch((err) => {
      console.error(`Background job ${jobId} crashed:`, err.message);
    });

    res.json({
      jobId,
      status: "pending",
      progress: 0,
      currentStep: "Waiting to start...",
      message: "Analysis started. Poll /analyze/status/:jobId for progress.",
    });
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: "Failed to start analysis. Please try again." });
  }
});

// ─── GET /analyze/status/:jobId ──────────────────────────────────────────────
router.get("/analyze/status/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await AnalysisJob.findOne({ jobId });

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    if (job.status === "completed") {
      const analyzed = await AnalyzedVideo.findOne({ videoId: job.videoId });
      if (!analyzed) {
        return res.status(404).json({ error: "Analysis result not found." });
      }

      return res.json({
        status: "completed",
        progress: 100,
        currentStep: "Analysis complete!",
        ...buildResultResponse(analyzed),
      });
    }

    if (job.status === "failed") {
      return res.json({
        status: "failed",
        progress: job.progress,
        currentStep: job.currentStep,
        error: job.error,
      });
    }

    res.json({
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
    });
  } catch (err) {
    console.error("Status check error:", err.message);
    res.status(500).json({ error: "Failed to check job status." });
  }
});

// ─── PATCH /analyze/notify/:jobId ────────────────────────────────────────────
router.patch("/analyze/notify/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required." });
    }

    const job = await AnalysisJob.findOne({ jobId });
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    job.email = email;
    await job.save();

    // If job already completed before user submitted email, send email now
    if (job.status === "completed" && !job.emailSent) {
      const analyzed = await AnalyzedVideo.findOne({ videoId: job.videoId });
      const { sendCompletionEmail } = require("../services/emailService");
      await sendCompletionEmail(email, job.videoId, analyzed?.videoInfo || {});
      job.emailSent = true;
      await job.save();
    }

    res.json({ success: true, message: "You'll be notified when analysis is complete." });
  } catch (err) {
    console.error("Notify subscription error:", err.message);
    res.status(500).json({ error: "Failed to subscribe for notifications." });
  }
});

// ─── GET /analyze/history ────────────────────────────────────────────────────
router.get("/analyze/history", async (req, res) => {
  try {
    const { userIdentifier, identifierType } = getUserIdentity(req);

    const entries = await UserAnalytics.find({ userIdentifier, identifierType })
      .sort({ lastAccessedAt: -1 })
      .populate("analyzedVideo", "videoId videoInfo summary.total analyzedAt")
      .lean();

    const history = entries.map((h) => ({
      videoId: h.videoId,
      title: h.analyzedVideo?.videoInfo?.title || null,
      thumbnail: h.analyzedVideo?.videoInfo?.thumbnail || null,
      channelTitle: h.analyzedVideo?.videoInfo?.channelTitle || null,
      totalComments: h.analyzedVideo?.summary?.total || 0,
      analyzedAt: h.analyzedAt,
      lastAccessedAt: h.lastAccessedAt,
      isComplete: !!h.analyzedVideo,
    }));

    const todayUsage = await getDailyUsage(userIdentifier, identifierType);

    res.json({
      history,
      dailyLimit: {
        used: todayUsage,
        max: DAILY_LIMIT,
        canAnalyze: todayUsage < DAILY_LIMIT,
        resetsAt: getResetTime(),
      },
    });
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch analysis history." });
  }
});

// ─── POST /analyze/migrate-history ───────────────────────────────────────────
router.post("/analyze/migrate-history", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Login required to migrate history." });
    }

    const ip = req.ip || req.connection?.remoteAddress;
    const userId = req.user._id.toString();

    const ipEntries = await UserAnalytics.find({ userIdentifier: ip, identifierType: "ip" });

    let migrated = 0;
    for (const entry of ipEntries) {
      const exists = await UserAnalytics.findOne({
        userIdentifier: userId,
        identifierType: "user",
        videoId: entry.videoId,
      });
      if (!exists) {
        await UserAnalytics.create({
          userIdentifier: userId,
          identifierType: "user",
          videoId: entry.videoId,
          analyzedVideo: entry.analyzedVideo,
          analyzedAt: entry.analyzedAt,
          lastAccessedAt: entry.lastAccessedAt,
        });
        migrated++;
      }
    }

    if (migrated > 0) {
      await UserAnalytics.deleteMany({ userIdentifier: ip, identifierType: "ip" });
    }

    res.json({ migrated });
  } catch (err) {
    console.error("Migration error:", err.message);
    res.status(500).json({ error: "Failed to migrate history." });
  }
});

// ─── DELETE /analyze/history/:videoId (remove from history only) ─────────────
// IMPORTANT: This route must be BEFORE /analyze/:videoId to avoid :videoId matching "history"
router.delete("/analyze/history/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userIdentifier, identifierType } = getUserIdentity(req);

    await UserAnalytics.deleteOne({ userIdentifier, identifierType, videoId });

    res.json({ success: true });
  } catch (err) {
    console.error("Remove from history error:", err.message);
    res.status(500).json({ error: "Failed to remove from history." });
  }
});

// ─── DELETE /analyze/:videoId ────────────────────────────────────────────────
router.delete("/analyze/:videoId", rateLimit, async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ error: "videoId is required." });
    }

    const { userIdentifier, identifierType } = getUserIdentity(req);

    // Delete user's history entry for this video
    await UserAnalytics.deleteOne({ userIdentifier, identifierType, videoId });

    // Delete the global cache so re-analysis gets fresh data
    await AnalyzedVideo.findOneAndDelete({ videoId });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete analysis error:", err.message);
    res.status(500).json({ error: "Failed to delete analysis." });
  }
});

module.exports = router;
