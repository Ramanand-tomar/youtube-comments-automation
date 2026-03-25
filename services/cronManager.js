const cron = require("node-cron");
const fetchComments = require("./fetchComments");
const autoReply = require("./autoReply");
const { createYoutubeClient } = require("./youtubeClientFactory");
const User = require("../models/User");

const userCrons = new Map();

function startUserCron(user) {
  const userId = user._id.toString();

  // Stop existing cron if running
  stopUserCron(userId);

  if (!user.refreshToken || !user.channelId) {
    console.log(`Cannot start cron for user ${userId}: missing token or channel`);
    return;
  }

  const interval = user.cronInterval || "*/10 * * * *";
  if (!cron.validate(interval)) {
    console.error(`Invalid cron interval for user ${userId}: ${interval}`);
    return;
  }

  const task = cron.schedule(interval, async () => {
    try {
      console.log(`Running cron job for user ${userId}...`);
      const freshUser = await User.findById(userId);
      if (!freshUser || !freshUser.autoReplyEnabled) {
        stopUserCron(userId);
        return;
      }

      const { youtube } = createYoutubeClient(freshUser.refreshToken);
      await fetchComments(youtube, userId, freshUser.channelId);
      await autoReply(youtube, userId, freshUser.aiPromptTemplate, {
        autoReplyMode: freshUser.autoReplyMode,
        autoReplyVideoIds: freshUser.autoReplyVideoIds,
      });
    } catch (error) {
      console.error(`Cron error for user ${userId}:`, error.message);
    }
  });

  userCrons.set(userId, task);
  console.log(`Cron started for user ${userId} at interval: ${interval}`);
}

function stopUserCron(userId) {
  const task = userCrons.get(userId);
  if (task) {
    task.stop();
    userCrons.delete(userId);
    console.log(`Cron stopped for user ${userId}`);
  }
}

function restartUserCron(user) {
  stopUserCron(user._id.toString());
  startUserCron(user);
}

async function initAllCrons() {
  const users = await User.find({ autoReplyEnabled: true, refreshToken: { $exists: true, $ne: null } });
  console.log(`Initializing crons for ${users.length} active users...`);
  for (const user of users) {
    if (user.channelId) {
      startUserCron(user);
    }
  }
}

module.exports = { startUserCron, stopUserCron, restartUserCron, initAllCrons };
