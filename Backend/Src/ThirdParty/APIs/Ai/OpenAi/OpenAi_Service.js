const openAi_API = require("./OpenAi_API");
const OpenAiTweetAnalysis = require("../../../../Data/Model/OpenAi_TweetAnalysis");

const DEFAULT_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `
You will receive a Tweet's content and context.

Your response MUST follow this exact format:

One-sentence result: <one concise sentence>
Key words * <keyword 1> * <keyword 2> * <keyword 3>

Rules:
- Exactly ONE sentence after "One-sentence result:"
- Use "Key words *" format (asterisks, not commas)
- No opinions
- No extra text
`.trim();

function buildPayload({ text, model = DEFAULT_MODEL }) {
  return {
    model,
    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: text,
      },
    ],
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

module.exports = {
  analyzeTweetText,
};
