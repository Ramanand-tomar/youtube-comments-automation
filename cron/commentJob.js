const fetchComments = require("../services/fetchComments");
const autoReply = require("../services/autoReply");

async function runJob(youtube, userId, channelId, promptTemplate) {
  await fetchComments(youtube, userId, channelId);
  await autoReply(youtube, userId, promptTemplate);
}

module.exports = runJob;
