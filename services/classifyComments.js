const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BATCH_SIZE = 50;

const CLASSIFICATION_PROMPT = `You are a YouTube comment classifier. Classify each comment into one or more of these categories (a comment can belong to multiple categories):

1. "suggestion" - Next video ideas, topic suggestions, or requests for future content
2. "appreciation" - Positive feedback, thanks, praise, compliments, or encouragement
3. "negative" - Criticism, complaints, negative feedback, or dissatisfaction
4. "success_story" - User sharing their success, achievement, or positive outcome related to the content
5. "query" - Questions, doubts, requests for help or clarification

Return ONLY a valid JSON array (no markdown, no code blocks) where each element is:
{"index": <number>, "categories": ["<category_key>", ...]}

Comments to classify:
`;

function buildBatchPrompt(comments, startIndex) {
  let numbered = "";
  for (let i = 0; i < comments.length; i++) {
    const text = comments[i].text.replace(/\n/g, " ").slice(0, 300);
    numbered += `${startIndex + i}. ${text}\n`;
  }
  return CLASSIFICATION_PROMPT + numbered;
}

function parseGeminiResponse(text) {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {}

  // Extract JSON from markdown code blocks
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1].trim());
    } catch {}
  }

  // Try to find array in the text
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {}
  }

  return null;
}

const VALID_CATEGORIES = ["suggestion", "appreciation", "negative", "success_story", "query"];

async function classifyBatch(comments, startIndex) {
  const prompt = buildBatchPrompt(comments, startIndex);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const parsed = parseGeminiResponse(response.text);
  if (!Array.isArray(parsed)) return {};

  const mapping = {};
  for (const item of parsed) {
    if (typeof item.index !== "number") continue;

    // Support both formats: { categories: [...] } and legacy { category: "..." }
    let cats = [];
    if (Array.isArray(item.categories)) {
      cats = item.categories.filter((c) => VALID_CATEGORIES.includes(c));
    } else if (VALID_CATEGORIES.includes(item.category)) {
      cats = [item.category];
    }

    if (cats.length > 0) {
      mapping[item.index] = cats;
    }
  }
  return mapping;
}

async function classifyComments(comments) {
  const categoryMap = {};

  // Process in batches
  for (let i = 0; i < comments.length; i += BATCH_SIZE) {
    const batch = comments.slice(i, i + BATCH_SIZE);
    try {
      const batchResult = await classifyBatch(batch, i);
      Object.assign(categoryMap, batchResult);
    } catch (err) {
      console.error(`Classification batch error (index ${i}):`, err.message);
    }
  }

  const summary = {
    suggestion: 0,
    appreciation: 0,
    negative: 0,
    success_story: 0,
    query: 0,
    total: comments.length,
  };

  const classified = comments.map((comment, idx) => {
    const categories = categoryMap[idx] || ["query"];
    for (const cat of categories) {
      summary[cat]++;
    }
    return { ...comment, categories };
  });

  return { classified, summary };
}

module.exports = classifyComments;
