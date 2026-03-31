const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const email = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!email || !pass) {
    console.warn("Email service not configured: SMTP_EMAIL or SMTP_APP_PASSWORD missing");
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: email, pass },
  });

  return transporter;
}

async function sendCompletionEmail(toEmail, videoId, videoInfo) {
  const t = getTransporter();
  if (!t) return;

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resultsLink = `${frontendUrl}/analytics?videoId=${videoId}`;
  const title = videoInfo?.title || "Your video";
  const thumbnail = videoInfo?.thumbnail || "";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #ea580c, #f59e0b); padding: 28px 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Video Analysis Complete!</h1>
      </div>
      ${thumbnail ? `<img src="${thumbnail}" alt="${title}" style="width: 100%; height: auto; display: block;" />` : ""}
      <div style="padding: 24px;">
        <h2 style="margin: 0 0 8px; font-size: 16px; color: #171717;">${title}</h2>
        ${videoInfo?.channelTitle ? `<p style="margin: 0 0 20px; color: #737373; font-size: 14px;">${videoInfo.channelTitle}</p>` : ""}
        <p style="color: #525252; font-size: 14px; line-height: 1.6;">
          Your YouTube video comment analysis is ready! Click the button below to view the full breakdown including sentiment categories, suggestions, and more.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resultsLink}" style="display: inline-block; background: #ea580c; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px;">
            View Analysis Results
          </a>
        </div>
        <p style="color: #a3a3a3; font-size: 12px; text-align: center; margin: 0;">
          This is an automated notification from YouTube Comment Analytics.
        </p>
      </div>
    </div>
  `;

  try {
    await t.sendMail({
      from: `"YouTube Analytics" <${process.env.SMTP_EMAIL}>`,
      to: toEmail,
      subject: `Analysis Ready: ${title}`,
      html,
    });
    console.log(`Completion email sent to ${toEmail}`);
  } catch (err) {
    console.error("Failed to send completion email:", err.message);
  }
}

async function sendFailureEmail(toEmail, videoId, errorMessage) {
  const t = getTransporter();
  if (!t) return;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #dc2626; padding: 28px 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Analysis Failed</h1>
      </div>
      <div style="padding: 24px;">
        <p style="color: #525252; font-size: 14px; line-height: 1.6;">
          Unfortunately, we couldn't complete the analysis for video <strong>${videoId}</strong>.
        </p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
          <p style="color: #991b1b; font-size: 13px; margin: 0;">${errorMessage || "An unexpected error occurred."}</p>
        </div>
        <p style="color: #737373; font-size: 14px;">You can try analyzing the video again later.</p>
        <p style="color: #a3a3a3; font-size: 12px; text-align: center; margin: 20px 0 0;">
          This is an automated notification from YouTube Comment Analytics.
        </p>
      </div>
    </div>
  `;

  try {
    await t.sendMail({
      from: `"YouTube Analytics" <${process.env.SMTP_EMAIL}>`,
      to: toEmail,
      subject: `Analysis Failed: Video ${videoId}`,
      html,
    });
    console.log(`Failure email sent to ${toEmail}`);
  } catch (err) {
    console.error("Failed to send failure email:", err.message);
  }
}

module.exports = { sendCompletionEmail, sendFailureEmail };
