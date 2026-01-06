const { sendDataToAi } = require("./OpenAi_Service");

const XTweetModel = require("../../../../Data/Model/X_TweetCache");

async function analyzeTweet(req, res) {
  try {
    const tweets = await XTweetModel.find({});

    const results = await Promise.all(
      tweets.map(async (tweet) => {
        const data = await sendDataToAi(tweet.text);

        return data;
      })
    );

    return res.status(200).json(results);
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
};
