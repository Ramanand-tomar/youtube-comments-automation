
const { GoogleGenAI } = require("@google/genai");
const { DEFAULT_PROMPT } = require("../models/User");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateReply(commentText, promptTemplate) {
  const template = promptTemplate || DEFAULT_PROMPT;
  const prompt = `${template}

User comment: "${commentText}"

Reply:`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.trim();
}

module.exports = generateReply;

