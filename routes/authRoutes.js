const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const User = require("../models/User");
const { generateToken, authMiddleware } = require("../middleware/auth");
const { createYoutubeClient } = require("../services/youtubeClientFactory");
const { startUserCron } = require("../services/cronManager");
const fetchComments = require("../services/fetchComments");

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
];

// GET /api/auth/google - Generate OAuth consent URL
router.get("/google", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });

  res.json({ url });
});

// GET /api/auth/google/callback - Handle OAuth callback
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get Google profile
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    // Get YouTube channel info
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    let channelId = null;
    let channelName = null;
    try {
      const channelRes = await youtube.channels.list({ part: "snippet", mine: true });
      if (channelRes.data.items && channelRes.data.items.length > 0) {
        channelId = channelRes.data.items[0].id;
        channelName = channelRes.data.items[0].snippet.title;
      }
    } catch (err) {
      console.error("Could not fetch YouTube channel:", err.message);
    }

    // Upsert user
    const user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        googleId: profile.id,
        email: profile.email,
        name: profile.name,
        profilePicture: profile.picture,
        channelId,
        channelName,
        refreshToken: tokens.refresh_token || undefined,
        connectedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update refresh token only if we got a new one
    if (tokens.refresh_token) {
      user.refreshToken = tokens.refresh_token;
      await user.save();
    }

    // Start cron job for this user if auto-reply enabled
    if (user.autoReplyEnabled && user.refreshToken && user.channelId) {
      startUserCron(user);
    }

    // Auto-fetch comments on first connect (don't await — let it run in background)
    if (user.refreshToken && user.channelId) {
      const { youtube: ytClient } = createYoutubeClient(user.refreshToken);
      fetchComments(ytClient, user._id.toString(), user.channelId)
        .then(() => console.log(`Initial comment fetch done for user ${user._id}`))
        .catch((err) => console.error("Initial fetch error:", err.message));
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/dashboard?token=${token}`);
  } catch (error) {
    console.error("OAuth callback error:", error.message);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/dashboard?error=auth_failed`);
  }
});

// GET /api/auth/me - Get current user (protected)
router.get("/me", authMiddleware, (req, res) => {
  const { refreshToken, ...userObj } = req.user.toObject();
  res.json({ user: userObj });
});

// POST /api/auth/logout - Logout (protected)
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
