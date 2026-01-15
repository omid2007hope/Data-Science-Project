const { sendDataToAi } = require("../../../Service/V1/Ai/OpenAi");

const XTweetModel = require("../../../Model/X_Tweet");

async function analyzeTweet(req, res) {
  try {
    const tweets = await XTweetModel.find({});

    const tweetList = await Promise.all(
      tweets.map(async (tweet) => {
        return { text: tweet.text, id: tweet._id };
      })
    );

    const data = await sendDataToAi(tweetList);

    return res.status(200).json(data.results);
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
