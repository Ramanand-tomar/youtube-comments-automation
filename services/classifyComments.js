const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BATCH_SIZE = 50;

const CLASSIFICATION_PROMPT = `You are an expert YouTube comment classifier. Classify each comment into one or more of these 5 categories. A comment CAN belong to multiple categories if it fits more than one. Be precise and thoughtful.

CATEGORIES:

1. "suggestion" — The commenter is requesting or suggesting a SPECIFIC topic, exercise, subject, or idea for a FUTURE video. They want the creator to make content about something.
   YES: "Can you make a video on sciatica exercises?", "Please do a tutorial on Python", "Next video on weight loss please"
   NO: "Can you help me with my pain?" (this is a query, not a video suggestion), "Good video" (appreciation)

2. "appreciation" — The commenter is expressing gratitude, praise, admiration, love, or positive sentiment toward the creator or content. Includes greetings with positive intent.
   YES: "Thank you so much!", "Great video", "You're the best", "Superb thanks a lot", "Love your content", "Namaste sir ji", "Good morning sir", "Good evening sir"
   NO: "Day 3 done" (this is a success story), "How to do exercise 2?" (this is a query)

3. "negative" — The commenter is expressing dissatisfaction, criticism, complaints, frustration, or negative feedback about the content or creator.
   YES: "This didn't work for me", "Waste of time", "Bad advice", "You're wrong about this"
   NO: "I have pain in my leg" (this is sharing experience/query, not criticizing the creator)

4. "success_story" — The commenter is sharing their personal progress, achievement, milestone, routine experience, or results from following the content. Includes progress logs and sharing personal experiences.
   YES: "Day 2", "Day 3, 4, 5 done", "I've been doing this for a month", "Only exercise 1 and 5 I am able to do", "I lost 5kg following this", "I opted for this for one month instead of regular session", "I need to concentrate on consistency. Because of my daily routine I am unable to do daily"
   NO: "How long will it take to heal?" (this is a query)

5. "query" — The commenter is asking a genuine question, seeking advice, requesting clarification, or describing their personal medical/health condition seeking help. Includes asking about specific situations.
   YES: "How many times should I do this?", "I have left leg pain, what should I do?", "Is it safe during pregnancy?", "Doctor told me to get a replacement, can I do this exercise?", "How many days will it take to recover?"
   NO: "Day 5 done" (success story), "Great video sir" (appreciation), "Please make video on back pain" (suggestion)

IMPORTANT RULES:
- Simple greetings like "Good morning sir", "Good evening", "Namaste sir ji" are APPRECIATION (showing respect/positivity), NOT queries.
- Progress updates like "Day 2", "Day 3, 4, 5 done" are SUCCESS_STORY, NOT queries.
- Comments sharing personal pain/condition AND asking for help get BOTH "query" (for the question part) categories.
- Comments like "Superb! Can you make a video on X?" get BOTH "appreciation" AND "suggestion".
- If a comment truly doesn't fit any category well, classify as "query" as a last resort.

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
