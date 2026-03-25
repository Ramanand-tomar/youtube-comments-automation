const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { restartUserCron, stopUserCron } = require("../services/cronManager");

// GET /api/dashboard/settings
router.get("/", authMiddleware, (req, res) => {
  res.json({
    cronInterval: req.user.cronInterval,
    autoReplyEnabled: req.user.autoReplyEnabled,
    autoReplyMode: req.user.autoReplyMode,
    autoReplyVideoIds: req.user.autoReplyVideoIds,
    aiPromptTemplate: req.user.aiPromptTemplate
  });
});

// PUT /api/dashboard/settings
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { cronInterval, autoReplyEnabled, autoReplyMode, autoReplyVideoIds, aiPromptTemplate } = req.body;
    const user = req.user;

    if (cronInterval !== undefined) user.cronInterval = cronInterval;
    if (autoReplyEnabled !== undefined) user.autoReplyEnabled = autoReplyEnabled;
    if (autoReplyMode !== undefined) user.autoReplyMode = autoReplyMode;
    if (autoReplyVideoIds !== undefined) user.autoReplyVideoIds = autoReplyVideoIds;
    if (aiPromptTemplate !== undefined) user.aiPromptTemplate = aiPromptTemplate;

    await user.save();

    // Reschedule cron
    if (user.autoReplyEnabled && user.refreshToken && user.channelId) {
      restartUserCron(user);
    } else {
      stopUserCron(user._id.toString());
    }

    res.json({
      message: "Settings updated",
      cronInterval: user.cronInterval,
      autoReplyEnabled: user.autoReplyEnabled,
      autoReplyMode: user.autoReplyMode,
      autoReplyVideoIds: user.autoReplyVideoIds,
      aiPromptTemplate: user.aiPromptTemplate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
