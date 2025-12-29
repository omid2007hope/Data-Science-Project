const X_API = require("./X_API");
const XTweet = require("../../../Data/Model/X_TweetCache");

async function getUserTweets(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  // 1️⃣ CHECK CACHE (latest tweet for this user)
  const cached = await XTweet.findOne({ author_id: userId })
    .sort({ created_at: -1 })
    .lean();

  if (cached) {
    return {
      source: "cache",
      data: cached,
    };
  }

  try {
    // 2️⃣ FETCH FROM X API (OFFICIAL ENDPOINT)
    const response = await X_API.get(`/users/${userId}/tweets`, {
      params: {
        max_results: 10,
        exclude: "retweets,replies",
        "tweet.fields": "created_at,public_metrics,lang",
      },
    });

    // 3️⃣ EXTRACT TWEET (X API ALWAYS RETURNS AN ARRAY)
    const tweet = response?.data?.data?.[0];

    if (!tweet) {
      return {
        source: "x_api",
        data: null, // user has no tweets
      };
    }

    // 4️⃣ MAP EXACTLY TO XTweet SCHEMA (DOC-ALIGNED)
    const objectStructure = {
      id: tweet.id,
      text: tweet.text,
      created_at: new Date(tweet.created_at),
      lang: tweet.lang,
      public_metrics: {
        like_count: tweet.public_metrics.like_count,
        retweet_count: tweet.public_metrics.retweet_count,
        reply_count: tweet.public_metrics.reply_count,
        quote_count: tweet.public_metrics.quote_count,
      },
      author_id: userId,
    };

    // 5️⃣ UPSERT (SAFE FOR CACHING)
    const savedTweet = await XTweet.findOneAndUpdate(
      { id: tweet.id },
      { $set: objectStructure },
      { upsert: true, new: true }
    ).lean();

    return {
      source: "x_api",
      data: savedTweet,
    };
  } catch (err) {
    const status = err.response?.status;

    if (status === 429) {
      const reset = err.response?.headers["x-rate-limit-reset"];

      throw {
        status: 429,
        message: "X API rate limit exceeded",
        resetAt: reset ? Number(reset) * 1000 : null,
      };
    }

    throw {
      status: status || 500,
      message: "Failed to fetch user tweets",
      details: err.response?.data || err.message,
    };
  }
}

module.exports = getUserTweets;
