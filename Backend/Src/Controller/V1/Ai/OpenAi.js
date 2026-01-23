//! ......................................................
//! Importing

const { sendDataToAi } = require("../../../Service/V1/Ai/OpenAi");
const XTweetModel = require("../../../Model/X_Tweet");
const XTweetAnalysisModel = require("../../../Model/X_TweetAnalysis");

//! ......................................................
//! AnalyzeTweet function

async function analyzeTweet(req, res) {
  try {
    //! ......................................................
    //! Get all saved Tweets from DataBase

    const tweets = await XTweetModel.find({});
    //! ......................................................
    //! Simplify
    const tweetList = await Promise.all(
      tweets.map(async (tweet) => {
        return { text: tweet.text, id: tweet._id };
      }),
    );

    //! ......................................................
    //! Send all Tweets to sendDataToAi function in OpenAi.js (Service)

    const data = await sendDataToAi(tweetList);

    //! ......................................................
    //! ......................................................

    const tweetById = new Map(
      tweets.map((tweet) => [String(tweet._id), tweet]),
    );

    await Promise.all(
      data.results.map(async (result) => {
        const tweet = tweetById.get(String(result.id));
        if (!tweet || !result?.oneSentence) return null;

        return XTweetAnalysisModel.findOneAndUpdate(
          { XTweet: tweet._id },
          {
            $set: {
              XTweet: tweet._id,
              text: tweet.text,
              oneSentence: result.oneSentence,
              keywords: result.keywords || [],
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }),
    );

    return res.status(200).json(data.results);
  } catch (error) {
    console.error("OpenAI Error | Controller", error.message);
    return res.status(500).json({
      message: "OpenAI request failed",
      error: error.message,
    });
  }
}

//! ......................................................
//! Get all saved TweetAnalyses directly from DataBase function

async function getAllTweetAnalyses(req, res) {
  try {
    //! ......................................................
    //! Search the DataBase for all TweetAnalyses

    const analyses = await XTweetAnalysisModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    //! ......................................................
    //! Return all TweetAnalyses (Respond)

    return res.status(200).json(analyses);
    //! ......................................................
    //! Catch any error
  } catch (error) {
    console.error("Tweet Analysis Fetch Error | Controller", error.message);
    return res.status(500).json({
      message: "Failed to fetch tweet analyses",
      error: error.message,
    });
  }
}

module.exports = {
  analyzeTweet,
  getAllTweetAnalyses,
};
