require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent" // Force to get refresh token
});

console.log("1. Authorize this app by visiting this url:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("2. Enter the code from that page here: ", (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error("Error retrieving access token", err);
    console.log("\n3. Your REFRESH_TOKEN is:\n");
    console.log(token.refresh_token);
    console.log("\nCopy this into your .env file as REFRESH_TOKEN=your_token_here");
  });
});
