const { google } = require("googleapis");
const Comment = require("../models/Comment");

async function fetchComments(youtube) {
  try {
    console.log("Fetching comments for channel:", process.env.CHANNEL_ID);
    const res = await youtube.commentThreads.list({
      part: "snippet",
      allThreadsRelatedToChannelId: process.env.CHANNEL_ID,
      maxResults: 50, // Increased for better coverage
      order: "time"
    });

    if (!res.data.items || res.data.items.length === 0) {
      console.log("No comments found.");
      return;
    }

    let count = 0;
    for (const item of res.data.items) {
      const comment = item.snippet.topLevelComment.snippet;

      // Use upsert to avoid duplicates
      await Comment.findOneAndUpdate(
        { commentId: item.id },
        {
          commentId: item.id,
          videoId: item.snippet.videoId,
          text: comment.textDisplay,
          author: comment.authorDisplayName,
          createdAt: comment.publishedAt
        },
        { upsert: true, new: true }
      );
      count++;
    }
    console.log(`Successfully fetched and stored ${count} comments.`);
  } catch (error) {
    console.error("Error fetching comments from YouTube:", error.message);
  }
}

module.exports = fetchComments;
