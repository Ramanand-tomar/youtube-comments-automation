const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BATCH_SIZE = 50;

const CLASSIFICATION_PROMPT = `You are an expert YouTube comment classifier. Classify each comment into one or more of these categories. A comment CAN belong to multiple categories if it genuinely fits more than one. Be STRICT and precise — only assign a category when the comment clearly matches.

CATEGORIES:

1. "suggestion" — The commenter is requesting or suggesting a SPECIFIC topic, exercise, subject, or idea for a FUTURE video. They want the creator to make content about something.
   YES: "Can you make a video on sciatica exercises?", "Please do a tutorial on Python", "Next video on weight loss please"
   NO: "Can you help me with my pain?" (query, not a video suggestion), "Good video" (appreciation)

2. "appreciation" — The commenter is expressing genuine gratitude, praise, admiration, or positive sentiment toward the creator or content. Must show clear positive intent beyond a single neutral word.
   YES: "Thank you so much!", "Great video", "You're the best", "Superb thanks a lot", "Love your content", "Namaste sir ji", "Good morning sir"
   NO: "Day 3 done" (success story), "Ok" (too vague, not appreciation), "Okay" (neutral acknowledgment)

3. "negative" — The commenter is expressing dissatisfaction, criticism, complaints, frustration, or negative feedback about the content or creator.
   YES: "This didn't work for me", "Waste of time", "Bad advice", "You're wrong about this"
   NO: "I have pain in my leg" (sharing experience/query, not criticizing the creator)

4. "success_story" — The commenter is sharing their personal progress, achievement, milestone, routine experience, or results from following the content.
   YES: "Day 2", "Day 3, 4, 5 done", "I've been doing this for a month", "I lost 5kg following this"
   NO: "How long will it take to heal?" (query)

5. "query" — The commenter is asking a genuine, specific question, seeking advice, requesting clarification, or describing a personal situation while seeking help. Must contain an actual question or a clear request for guidance.
   YES: "How many times should I do this?", "I have left leg pain, what should I do?", "Is it safe during pregnancy?", "How many days will it take to recover?"
   NO: "Day 5 done" (success story), "Great video sir" (appreciation), "Ok" (not a question)

6. "irrelevant" — The comment is vague, generic, off-topic, spam, self-promotion, meaningless, or does NOT clearly fit any of the above 5 categories. This includes:
   - Single-word reactions with no clear sentiment: "Okay", "Ok", "Hmm", "First", "Haha", "Lol"
   - Random or unintelligible text, emojis-only comments, timestamps-only
   - Spam, self-promotion, or completely off-topic comments
   - Generic filler that adds no meaning: "Nice", "Wow" (unless clearly enthusiastic praise)
   YES: "Okay", "Ok", "Hmm", "First", "...", "Lol", "Check out my channel", random gibberish
   NO: "Nice video, very helpful!" (this IS appreciation), "Ok so how do I do step 3?" (this IS a query)

IMPORTANT RULES:
- Be STRICT: do NOT force a comment into suggestion/appreciation/negative/success_story/query unless it clearly belongs. Use "irrelevant" for anything ambiguous or low-content.
- "query" is for REAL questions or help requests, NOT a catch-all. A comment must contain a question, a described problem seeking help, or a request for clarification to be a "query".
- Simple greetings like "Good morning sir", "Namaste sir ji" are APPRECIATION (showing respect/positivity).
- Progress updates like "Day 2", "Day 3 done" are SUCCESS_STORY.
- Comments sharing personal pain/condition AND asking for help get BOTH "query" and relevant categories.
- Comments like "Superb! Can you make a video on X?" get BOTH "appreciation" AND "suggestion".

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

const VALID_CATEGORIES = ["suggestion", "appreciation", "negative", "success_story", "query", "irrelevant"];

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
    irrelevant: 0,
    total: comments.length,
  };

  const DISPLAY_CATEGORIES = ["suggestion", "appreciation", "negative", "success_story", "query"];

  const classified = comments.map((comment, idx) => {
    const categories = categoryMap[idx] || ["irrelevant"];
    const displayCats = categories.filter((c) => DISPLAY_CATEGORIES.includes(c));
    if (displayCats.length > 0) {
      for (const cat of displayCats) {
        summary[cat]++;
      }
    } else {
      summary.irrelevant++;
    }
    return { ...comment, categories: displayCats.length > 0 ? displayCats : ["irrelevant"] };
  });

  return { classified, summary };
}

async function classifyCommentsWithProgress(comments, job) {
  const categoryMap = {};
  const totalBatches = Math.ceil(comments.length / BATCH_SIZE);

  for (let i = 0; i < comments.length; i += BATCH_SIZE) {
    const batch = comments.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    try {
      const batchResult = await classifyBatch(batch, i);
      Object.assign(categoryMap, batchResult);
    } catch (err) {
      console.error(`Classification batch error (index ${i}):`, err.message);
    }

    // Update progress: 40% to 90% range for classification
    const classifyProgress = 40 + Math.round((batchNum / totalBatches) * 50);
    job.progress = Math.min(classifyProgress, 90);
    job.currentStep = `Classifying comments with AI (batch ${batchNum}/${totalBatches})...`;
    await job.save();
  }

  const summary = {
    suggestion: 0,
    appreciation: 0,
    negative: 0,
    success_story: 0,
    query: 0,
    irrelevant: 0,
    total: comments.length,
  };

  const DISPLAY_CATEGORIES = ["suggestion", "appreciation", "negative", "success_story", "query"];

  const classified = comments.map((comment, idx) => {
    const categories = categoryMap[idx] || ["irrelevant"];
    const displayCats = categories.filter((c) => DISPLAY_CATEGORIES.includes(c));
    if (displayCats.length > 0) {
      for (const cat of displayCats) {
        summary[cat]++;
      }
    } else {
      summary.irrelevant++;
    }
    return { ...comment, categories: displayCats.length > 0 ? displayCats : ["irrelevant"] };
  });

  return { classified, summary };
}

module.exports = { classifyComments, classifyCommentsWithProgress };
