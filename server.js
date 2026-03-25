require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { initAllCrons } = require("./services/cronManager");
const { authMiddleware } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().then(() => {
  initAllCrons();
});

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Auth Routes (public)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Dashboard Routes (protected)
const commentController = require("./controllers/commentController");
const settingsRoutes = require("./routes/settingsRoutes");
const videoRoutes = require("./routes/videoRoutes");

const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/dashboard/settings", settingsRoutes);
app.use("/api/dashboard/videos", videoRoutes);
app.use("/api/dashboard/analytics", analyticsRoutes);

app.get("/api/dashboard/comments", authMiddleware, commentController.getComments);
app.post("/api/dashboard/comments/reply", authMiddleware, commentController.postManualReply);
app.post("/api/dashboard/comments/trigger", authMiddleware, commentController.triggerJob);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "running" });
});

// Production: serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
