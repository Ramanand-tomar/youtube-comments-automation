
 const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateReply(commentText) {
    
    const prompt = `
      You are a friendly and helpful YouTube creator. 
      Write a short, human-like, and polite reply to the following comment.

      User comment: "${commentText}"

      Requirements:
      - Max 1-2 lines.
      - Be genuine and friendly.
      - Avoid excessive emojis.
      - NO links, NO self-promotion, NO spam.
      - If the comment is just a greeting, say something like "Thanks for stopping by!" or "Hope you're having a great day!".
      
      Reply:`; 

    
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  console.log(response.text);
  return response.text.trim();
}

module.exports = generateReply;

// generateReply("this video is very awesome video please make this video in very decriptive way")


