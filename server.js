require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const connectDB = require("./config/db");
const runJob = require("./cron/commentJob");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// OAuth 2.0 Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Check for refresh token
if (!process.env.REFRESH_TOKEN) {
  console.warn("WARNING: REFRESH_TOKEN is missing in .env. Auto-reply will fail.");
}

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client
});

// Middleware
app.use(express.json());

// Routes
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes(youtube));

// Health Check
app.get("/", (req, res) => {
  res.send("YouTube Automation Server is running... 🚀");
});

// Manual Trigger for Testing
app.post("/test-run", async (req, res) => {
  try {
    console.log("Manual trigger: Running YouTube Comment Job...");
    await runJob(youtube);
    res.status(200).json({ message: "Job executed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cron Schedule: Runs every 10 minutes
cron.schedule("*/1 * * * *", () => {
  console.log("Running Scheduled YouTube Comment Job...");
  runJob(youtube);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
