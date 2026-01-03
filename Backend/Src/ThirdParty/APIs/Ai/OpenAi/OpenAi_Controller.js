const { analyzeTweetText, analyzeTweetsFromDb } = require("./OpenAi_Service");

async function analyzeTweet(req, res) {
  try {
    const { text, tweetId, userId, model, force } = req.body || {};

    if (!text) {
      return res.status(400).json({ message: "text is required" });
    }

    const result = await analyzeTweetText({
      text,
      tweetId,
      userId,
      model,
      force: Boolean(force),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("OpenAI Error | Controller", error.message);
    return res.status(500).json({
      message: "OpenAI request failed",
      error: error.message,
    });
  }
}

async function analyzeFromDb(req, res) {
  try {
    const { userId, limit, model, force } = req.body || {};

    const result = await analyzeTweetsFromDb({
      userId,
      limit,
      model,
      force: Boolean(force),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("OpenAI Error | Controller", error.message);
    return res.status(500).json({
      message: "OpenAI request failed",
      error: error.message,
    });
  }
}

module.exports = {
  analyzeTweet,
  analyzeFromDb,
};
