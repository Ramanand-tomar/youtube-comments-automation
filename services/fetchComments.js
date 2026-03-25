const Comment = require("../models/Comment");

async function fetchComments(youtube, userId, channelId) {
  try {
    console.log(`Fetching comments for user ${userId}, channel: ${channelId}`);
    const res = await youtube.commentThreads.list({
      part: "snippet",
      allThreadsRelatedToChannelId: channelId,
      maxResults: 50,
      order: "time"
    });

    if (!res.data.items || res.data.items.length === 0) {
      console.log("No comments found.");
      return;
    }

    const videoIds = [...new Set(res.data.items.map(item => item.snippet.videoId))];
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

      await Comment.findOneAndUpdate(
        { userId, commentId: item.id },
        {
          userId,
          commentId: item.id,
          videoId,
          videoTitle,
          text: comment.textDisplay,
          author: comment.authorDisplayName,
          createdAt: comment.publishedAt
        },
        { upsert: true, new: true }
      );
      count++;
    }
    console.log(`Stored ${count} comments for user ${userId}.`);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
  }
}

module.exports = fetchComments;
