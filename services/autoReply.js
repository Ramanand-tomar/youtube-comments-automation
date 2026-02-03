const Comment = require("../models/Comment");
const generateReply = require("./geminiReply");

async function autoReply(youtube) {
  try {
    // Fetch comments that haven't been replied to yet
    const comments = await Comment.find({ replied: false }).limit(10); // Limit per run to respect quota

    if (comments.length === 0) {
      console.log("No pending comments to reply to.");
      return;
    }

    console.log(`Processing ${comments.length} comments for auto-reply...`);

    for (let c of comments) {
      // 1. FILTERING LOGIC
      const lowercaseText = c.text.toLowerCase();
      const isSpam = 
        lowercaseText.includes("http") || 
        lowercaseText.includes("www") || 
        lowercaseText.includes("subscribe") || 
        lowercaseText.includes("check out my channel") ||
        c.text.length < 5;

      if (isSpam) {
        console.log(`Skipping spam/short comment: "${c.text.substring(0, 30)}..."`);
        c.replied = true; // Mark as processed so we don't check again
        await c.save();
        continue;
      }

      // 2. GENERATE AI REPLY
      let replyText;
      try {
        replyText = await generateReply(c.text);
      } catch (err) {
        console.error("Gemini error for comment:", c.commentId, err.message);
        replyText = "Thanks for your comment! I really appreciate it. 🙌";
      }

      // 3. POST REPLY TO YOUTUBE
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

        console.log(`Replied to: "${c.author}" with: "${replyText}"`);
        
        // 4. MARK AS REPLIED IN DB
        c.replied = true;
        await c.save();
      } catch (ytError) {
        console.error("YouTube API error while replying:", ytError.message);
        if (ytError.message.includes("quotaExceeded")) {
          console.error("YouTube Quota Exceeded! Stopping for this run.");
          break;
        }
        // If it's a "duplicate comment" error or similar, mark as replied to avoid infinite loop
        if (ytError.code === 403 || ytError.code === 409) {
          c.replied = true;
          await c.save();
        }
      }
    }
  } catch (error) {
    console.error("Fatal error in autoReply service:", error.message);
  }
}

module.exports = autoReply;
