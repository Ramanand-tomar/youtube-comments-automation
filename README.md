# YouTube Comment Automation & AI Reply Bot

A powerful Node.js automation tool that monitors your YouTube channel for new comments, generates personalized, human-like responses using Google Gemini AI, and automatically posts the replies back to YouTube.

## 🚀 Features

- **Automated Monitoring**: Periodically scans your YouTube channel for new comments using a cron job.
- **AI-Powered Replies**: Uses Google's Gemini Flash model to generate friendly, context-aware responses.
- **Spam Filtering**: Automatically detects and skips spammy comments or links to maintain channel quality.
- **Database Storage**: Keeps track of all comments and replies in MongoDB to avoid duplicate processing.
- **Manual Trigger**: Includes an API endpoint to manually trigger a sync if needed.
- **Robust Error Handling**: Handles API quotas and common failures gracefully.

---

## 🛠️ Tech Stack

- **Backend**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **AI**: Google Generative AI (Gemini)
- **Platform**: YouTube Data API v3
- **Scheduling**: Node-cron

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and connection string
- [Google Cloud Console](https://console.cloud.google.com/) Project with:
  - **YouTube Data API v3** enabled
  - **OAuth 2.0 Credentials** (Client ID and Client Secret)
- [Google AI Studio](https://aistudio.google.com/) API Key for Gemini

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd youtube-automation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

# YouTube API Credentials
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:3000
CHANNEL_ID=your_youtube_channel_id

# Obtained via token helper (see step 4)
REFRESH_TOKEN=your_refresh_token
```

### 4. Obtain YouTube Refresh Token
Since YouTube OAuth tokens expire, you need a `REFRESH_TOKEN` for the bot to run unattended.

1. Ensure your `CLIENT_ID`, `CLIENT_SECRET`, and `REDIRECT_URI` are in the `.env` file.
2. Run the helper script:
   ```bash
   node services/tokenHelper.js
   ```
3. Follow the URL in your terminal, authorize the app, and paste the code back into the terminal.
4. Copy the generated `REFRESH_TOKEN` into your `.env` file.

---

## 🏃 Running the Project

### Development Mode (with Nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once started, the bot will run every minute by default to check for new comments.

---

## 🧪 Testing

### Health Check
Verify the server is running:
`GET http://localhost:3000/`

### Manual Sync Trigger
To manually trigger the fetching and replying process without waiting for the cron job:
`POST http://localhost:3000/test-run`

---

## 📂 Project Structure

- `/config`: Database connection and authentication setup.
- `/controllers`: API route logic.
- `/cron`: Scheduled tasks configuration.
- `/models`: Mongoose schemas for MongoDB.
- `/routes`: Express route definitions.
- `/services`: Core business logic:
  - `fetchComments.js`: Connects to YouTube to get latest activity.
  - `geminiReply.js`: Interacts with AI to generate responses.
  - `autoReply.js`: Coordinates filtering and posting replies.
  - `tokenHelper.js`: Utility for OAuth setup.

---

## 🛡️ License

This project is licensed under the ISC License.

---

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any features or bug fixes.
