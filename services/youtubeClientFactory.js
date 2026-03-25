const { google } = require("googleapis");

function createYoutubeClient(refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client
  });

  return { oauth2Client, youtube };
}

module.exports = { createYoutubeClient };
