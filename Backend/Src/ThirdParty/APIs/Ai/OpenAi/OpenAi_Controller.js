const {
  analyzeTweetText,
  analyzeTweetsFromDb,
  buildPayload,
  sendDataToAi,
} = require("./OpenAi_Service");

const XTweetModel = require("../../../../Data/Model/X_TweetCache");

async function analyzeTweet(req, res) {
  try {
    // const { text, tweetId, userId, model, force } = req.body || {};

    // if (!text) {
    //   return res.status(400).json({ message: "text is required" });
    // }

    const tweets = await XTweetModel.find({});

    const results = await Promise.all(
      tweets.map(async (tweet) => {
        const data = await sendDataToAi(tweet.text);

        return data;
      })
    );

    // const result = await analyzeTweetText({
    //   text,
    //   tweetId,
    //   userId,
    //   model,
    //   force: Boolean(force),
    // });

    return res.status(200).json(results);
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
