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

    // 1. Collect unique video IDs
    const videoIds = [...new Set(res.data.items.map(item => item.snippet.videoId))];
    
    // 2. Fetch video titles
    const videoTitles = {};
    if (videoIds.length > 0) {
      const videoRes = await youtube.videos.list({
        part: "snippet",
        id: videoIds.join(",")
      });
      videoRes.data.items.forEach(v => {
        videoTitles[v.id] = v.snippet.title;
      });
    }

    let count = 0;
    for (const item of res.data.items) {
      const comment = item.snippet.topLevelComment.snippet;
      const videoId = item.snippet.videoId;
      const videoTitle = videoTitles[videoId] || "Unknown Video";

      // Use upsert to avoid duplicates
      await Comment.findOneAndUpdate(
        { commentId: item.id },
        {
          commentId: item.id,
          videoId: videoId,
          videoTitle: videoTitle,
          text: comment.textDisplay,
          author: comment.authorDisplayName,
          createdAt: comment.publishedAt
        },
        { upsert: true, new: true }
      );
      count++;
    }
    console.log(`Successfully fetched and stored ${count} comments with video titles.`);
  } catch (error) {
    console.error("Error fetching comments from YouTube:", error.message);
  }
}

module.exports = fetchComments;
