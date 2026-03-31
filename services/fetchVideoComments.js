const { google } = require("googleapis");

const MAX_COMMENTS = 500;

async function fetchVideoComments(videoId) {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  const allComments = [];
  let nextPageToken = null;

  do {
    const res = await youtube.commentThreads.list({
      part: "snippet",
      videoId,
      maxResults: 100,
      pageToken: nextPageToken || undefined,
      order: "relevance",
    });

    for (const item of res.data.items || []) {
      const snippet = item.snippet.topLevelComment.snippet;
      allComments.push({
        author: snippet.authorDisplayName,
        text: snippet.textDisplay,
        publishedAt: snippet.publishedAt,
        likeCount: snippet.likeCount || 0,
      });

      if (allComments.length >= MAX_COMMENTS) break;
    }

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken && allComments.length < MAX_COMMENTS);

  const videoInfo = await fetchVideoInfo(videoId);

  return {
    comments: allComments,
    totalFetched: allComments.length,
    videoInfo,
  };
}

async function fetchVideoInfo(videoId) {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });
    const videoRes = await youtube.videos.list({
      part: "snippet,statistics",
      id: videoId,
    });
    const item = videoRes.data.items?.[0];
    if (item) {
      return {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount || "0", 10),
        likeCount: parseInt(item.statistics.likeCount || "0", 10),
        commentCount: parseInt(item.statistics.commentCount || "0", 10),
      };
    }
  } catch (err) {
    console.error("Failed to fetch video info:", err.message);
  }
  return {};
}

async function fetchVideoCommentsWithProgress(videoId, job) {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  const allComments = [];
  let nextPageToken = null;
  let pageCount = 0;
  const estimatedPages = 5; // max 500 comments / 100 per page

  do {
    const res = await youtube.commentThreads.list({
      part: "snippet",
      videoId,
      maxResults: 100,
      pageToken: nextPageToken || undefined,
      order: "relevance",
    });

    for (const item of res.data.items || []) {
      const snippet = item.snippet.topLevelComment.snippet;
      allComments.push({
        author: snippet.authorDisplayName,
        text: snippet.textDisplay,
        publishedAt: snippet.publishedAt,
        likeCount: snippet.likeCount || 0,
      });

      if (allComments.length >= MAX_COMMENTS) break;
    }

    pageCount++;
    // Update progress: 10% to 40% range for comment fetching
    const fetchProgress = 10 + Math.round((pageCount / estimatedPages) * 30);
    job.progress = Math.min(fetchProgress, 40);
    job.currentStep = `Retrieving comments from YouTube (${allComments.length} fetched)...`;
    await job.save();

    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken && allComments.length < MAX_COMMENTS);

  const videoInfo = await fetchVideoInfo(videoId);

  return {
    comments: allComments,
    totalFetched: allComments.length,
    videoInfo,
  };
}

module.exports = { fetchVideoComments, fetchVideoInfo, fetchVideoCommentsWithProgress };
