const openAi_API = require("./OpenAi_API");
const OpenAiTweetAnalysis = require("../../../../Data/Model/OpenAi_TweetAnalysis");
const XTweet = require("../../../../Data/Model/X_TweetCache");

const DEFAULT_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `
You will receive one tweet or a list of tweets. Each tweet has:
{ "id": "<id>", "text": "<tweet text>" }.

Your response MUST follow this exact format for each tweet:

ID: <id>
One-sentence result: <one concise sentence>
Key words * <keyword 1> * <keyword 2> * <keyword 3>

Rules:
- Keep the same tweet order as input
- Echo the exact ID from input
- Exactly ONE sentence after "One-sentence result:"
- Use "Key words *" format (asterisks, not commas)
- No opinions
- No extra text
`.trim();

function buildPayload({ text, model = DEFAULT_MODEL }) {
  // console.log(text);

  return {
    model,
    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(text),
      },
    ],
  };
}

async function sendDataToAi(text) {
  const payload = buildPayload({
    text: text,
  });
  console.log(payload);
  const { data } = await openAi_API.post("/responses", payload);

  const outputText = extractOpenAiText(data);
  return {
    raw: data,
    results: parseOpenAiBatchResult(outputText),
    outputText,
  };
}

function extractOpenAiText(data) {
  if (!data) return "";

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  if (Array.isArray(data.output)) {
    const first = data.output[0];
    const content = first?.content?.[0];
    if (content?.text) return content.text;
  }

  if (Array.isArray(data.choices)) {
    return data.choices?.[0]?.message?.content || "";
  }

  return "";
}

function parseOpenAiResult(text) {
  const oneSentenceMatch = text.match(/One-sentence result:\s*(.*)/i);
  const keywordsMatch = text.match(/Key words\s*\*\s*(.*)/i);

  const oneSentence = oneSentenceMatch?.[1]?.trim() || null;

  const keywords =
    keywordsMatch?.[1]
      ?.split("*")
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 3) || [];

  return { oneSentence, keywords };
}

function parseOpenAiBatchResult(text) {
  if (!text) return [];

  const rawBlocks = text
    .split(/(?=^ID:\s*)/gm)
    .map((b) => b.trim())
    .filter(Boolean);

  return rawBlocks.map((block) => {
    const idMatch = block.match(/^ID:\s*(.+)$/im);
    const oneSentenceMatch = block.match(/One-sentence result:\s*(.*)/i);
    const keywordsMatch = block.match(/Key words\s*\*\s*(.*)/i);

    const keywords =
      keywordsMatch?.[1]
        ?.split("*")
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 3) || [];

    return {
      id: idMatch?.[1]?.trim() || null,
      text: block,
      oneSentence: oneSentenceMatch?.[1]?.trim() || null,
      keywords,
    };
  });
}

async function analyzeTweetText({
  text,
  tweetId,
  userId,
  model = DEFAULT_MODEL,
  force = false,
}) {
  if (!text) {
    throw new Error("Tweet text is required");
  }

  if (tweetId && !force) {
    const cached = await OpenAiTweetAnalysis.findOne({
      X_TweetID: tweetId,
      model,
    }).lean();

    if (cached) {
      return {
        source: "cache",
        data: cached,
      };
    }
  }

  const payload = buildPayload({ text, model });

  const response = await openAi_API.post("/responses", payload);
  const outputText = extractOpenAiText(response.data);
  const parsed = parseOpenAiResult(outputText);

  const created = await OpenAiTweetAnalysis.create({
    X_TweetID: tweetId || null,
    X_userID: userId || null,
    input_text: text,
    model,
    output_text: outputText,
    one_sentence: parsed.oneSentence,
    keywords: parsed.keywords,
    response_id: response.data?.id || null,
    raw_response: response.data || null,
  });

  return {
    source: "openai",
    data: created,
  };
}

async function analyzeTweetsFromDb({
  userId,
  limit = 5,
  model = DEFAULT_MODEL,
  force = false,
}) {
  const query = {};
  if (userId) {
    query.X_userID = userId;
  }

  const tweets = await XTweet.find(query)
    .sort({ created_at: -1 })
    .limit(Math.max(Number(limit) || 5, 1))
    .lean();

  if (!tweets.length) {
    return {
      requested: 0,
      analyzed: 0,
      skipped: 0,
      results: [],
    };
  }

  let existingById = new Set();
  if (!force) {
    const ids = tweets.map((t) => t.X_TweetID).filter(Boolean);
    const existing = await OpenAiTweetAnalysis.find({
      X_TweetID: { $in: ids },
      model,
    })
      .select({ X_TweetID: 1 })
      .lean();
    existingById = new Set(existing.map((e) => e.X_TweetID));
  }

  const results = [];
  let analyzed = 0;
  let skipped = 0;

  for (const tweet of tweets) {
    if (!tweet?.text) {
      skipped += 1;
      continue;
    }

    if (!force && tweet.X_TweetID && existingById.has(tweet.X_TweetID)) {
      skipped += 1;
      continue;
    }

    const result = await analyzeTweetText({
      text: tweet.text,
      tweetId: tweet.X_TweetID,
      userId: tweet.X_userID,
      model,
      force,
    });

    results.push(result.data);
    analyzed += 1;
  }

  return {
    requested: tweets.length,
    analyzed,
    skipped,
    results,
  };
}

module.exports = {
  analyzeTweetText,
  analyzeTweetsFromDb,
  buildPayload,
  sendDataToAi,
};
