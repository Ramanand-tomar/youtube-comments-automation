const mongoose = require("mongoose");

const DEFAULT_PROMPT = `You are a friendly and helpful YouTube creator.
Write a short, human-like, and polite reply to the following comment.

Requirements:
- Max 1-2 lines.
- Be genuine and friendly.
- Avoid excessive emojis.
- NO links, NO self-promotion, NO spam.
- If the comment is just a greeting, say something like "Thanks for stopping by!" or "Hope you're having a great day!".`;

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  email: String,
  name: String,
  profilePicture: String,
  channelId: String,
  channelName: String,
  refreshToken: String,
  connectedAt: Date,
  cronInterval: { type: String, default: "*/10 * * * *" },
  autoReplyEnabled: { type: Boolean, default: true },
  autoReplyMode: { type: String, enum: ["all", "selected"], default: "all" },
  autoReplyVideoIds: { type: [String], default: [] },
  aiPromptTemplate: { type: String, default: DEFAULT_PROMPT }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
module.exports.DEFAULT_PROMPT = DEFAULT_PROMPT;
