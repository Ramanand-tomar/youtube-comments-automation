const AnalysisJob = require("../models/AnalysisJob");
const AnalyzedVideo = require("../models/AnalyzedVideo");
const UserAnalytics = require("../models/UserAnalytics");
const { fetchVideoInfo, fetchVideoCommentsWithProgress } = require("./fetchVideoComments");
const { classifyCommentsWithProgress } = require("./classifyComments");
const { sendCompletionEmail, sendFailureEmail } = require("./emailService");

async function updateJob(job, status, progress, currentStep) {
  job.status = status;
  job.progress = progress;
  job.currentStep = currentStep;
  await job.save();
}

async function processAnalysisJob(jobId) {
  const job = await AnalysisJob.findOne({ jobId });
  if (!job) return;

  try {
    // Always run fresh analysis for every user
    // Step 1: Fetch video info (0-10%)
    await updateJob(job, "fetching_info", 5, "Fetching video information...");
    const videoInfo = await fetchVideoInfo(job.videoId);

    // Step 2: Fetch comments with progress (10-40%)
    await updateJob(job, "fetching_comments", 10, "Retrieving comments from YouTube...");
    const { comments, totalFetched } = await fetchVideoCommentsWithProgress(job.videoId, job);

    if (comments.length === 0) {
      throw new Error("No comments found. Comments may be disabled for this video.");
    }

    // Step 3: Classify with AI with progress (40-90%)
    await updateJob(job, "classifying", 40, "Classifying comments with AI...");
    const { classified, summary } = await classifyCommentsWithProgress(comments, job);

    // Step 4: Save results (90-100%)
    await updateJob(job, "saving", 92, "Generating analytics report...");

    const analyzed = await AnalyzedVideo.findOneAndUpdate(
      { videoId: job.videoId },
      { videoInfo, comments: classified, summary, totalFetched, analyzedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Backfill UserAnalytics entries created before analysis completed
    await UserAnalytics.updateMany(
      { videoId: job.videoId, analyzedVideo: null },
      { analyzedVideo: analyzed._id }
    );

    // Mark complete
    job.status = "completed";
    job.progress = 100;
    job.currentStep = "Analysis complete!";
    job.result = analyzed._id;
    await job.save();

    // Re-read job from DB to pick up email added via PATCH /notify while job was running
    const freshJob = await AnalysisJob.findOne({ jobId });
    if (freshJob?.email && !freshJob.emailSent) {
      await sendCompletionEmail(freshJob.email, freshJob.videoId, videoInfo);
      freshJob.emailSent = true;
      await freshJob.save();
    }
  } catch (err) {
    console.error(`Job ${jobId} failed:`, err.message);

    // Fallback: if fresh analysis fails, try to use global cache
    const fallback = await AnalyzedVideo.findOne({ videoId: job.videoId });
    if (fallback) {
      console.log(`Job ${jobId}: Using cached fallback for ${job.videoId}`);
      await UserAnalytics.updateMany(
        { videoId: job.videoId, analyzedVideo: null },
        { analyzedVideo: fallback._id }
      );

      job.status = "completed";
      job.progress = 100;
      job.currentStep = "Analysis complete!";
      job.result = fallback._id;
      await job.save();

      const freshJob = await AnalysisJob.findOne({ jobId });
      if (freshJob?.email && !freshJob.emailSent) {
        await sendCompletionEmail(freshJob.email, freshJob.videoId, fallback.videoInfo || {});
        freshJob.emailSent = true;
        await freshJob.save();
      }
      return;
    }

    // No fallback available — mark as failed
    job.status = "failed";
    job.error = err.message;
    await job.save();

    const freshJob = await AnalysisJob.findOne({ jobId });
    if (freshJob?.email && !freshJob.emailSent) {
      await sendFailureEmail(freshJob.email, freshJob.videoId, err.message);
      freshJob.emailSent = true;
      await freshJob.save();
    }
  }
}

module.exports = processAnalysisJob;
