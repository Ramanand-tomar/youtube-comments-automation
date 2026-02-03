const fetchComments = require("../services/fetchComments");
const autoReply = require("../services/autoReply");

async function runJob(youtube) {
  await fetchComments(youtube);
  await autoReply(youtube);
}

module.exports = runJob;
