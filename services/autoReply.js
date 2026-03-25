const Comment = require("../models/Comment");
const generateReply = require("./geminiReply");

async function autoReply(youtube, userId, promptTemplate, { autoReplyMode, autoReplyVideoIds } = {}) {
  try {
    const query = { userId, replied: false };
    if (autoReplyMode === "selected" && autoReplyVideoIds?.length > 0) {
      query.videoId = { $in: autoReplyVideoIds };
    }

    const comments = await Comment.find(query).limit(10);

    if (comments.length === 0) {
      console.log("No pending comments to reply to.");
      return;
    }

    console.log(`Processing ${comments.length} comments for user ${userId}...`);

    for (let c of comments) {
      const lowercaseText = c.text.toLowerCase();
      const isSpam =
        lowercaseText.includes("http") ||
        lowercaseText.includes("www") ||
        lowercaseText.includes("subscribe") ||
        lowercaseText.includes("check out my channel") ||
        c.text.length < 5;

      if (isSpam) {
        console.log(`Skipping spam: "${c.text.substring(0, 30)}..."`);
        c.replied = true;
        await c.save();
        continue;
      }

      let replyText;
      try {
        replyText = await generateReply(c.text, promptTemplate);
      } catch (err) {
        console.error("Gemini error:", c.commentId, err.message);
        replyText = "Thanks for your comment! I really appreciate it.";
      }

      try {
        await youtube.comments.insert({
          part: "snippet",
          requestBody: {
            snippet: {
              parentId: c.commentId,
              textOriginal: replyText
            }
          }
        });

        console.log(`Replied to "${c.author}": "${replyText}"`);
        c.replied = true;
        c.commentReply = replyText;
        await c.save();
      } catch (ytError) {
        console.error("YouTube API error:", ytError.message);
        if (ytError.message.includes("quotaExceeded")) {
          console.error("Quota exceeded, stopping this run.");
          break;
        }
        if (ytError.code === 403 || ytError.code === 409) {
          c.replied = true;
          await c.save();
        }
      }
    }
  } catch (error) {
    console.error("Fatal error in autoReply:", error.message);
  }
}

module.exports = autoReply;
