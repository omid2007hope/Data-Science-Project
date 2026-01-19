const {
  X_GetTweetTimeLimit,
  X_GetTweetLimit,
} = require("../../../Config/X_Config");

//! ......................................................
//! ......................................................

async function getUserTweets({
  xUserId,
  userId,
  limit = X_GetTweetLimit,
  timeLimit = X_GetTweetTimeLimit,
}) {
  //! ......................................................
  //! ......................................................

  if (!xUserId) {
    throw new Error("xUserId is required");
  }

  //! ......................................................
  //! ......................................................

  let X_TweetData = [];

  //! ......................................................
  //! ......................................................

  if (userId) {
    X_TweetData = await XTweet.find({ X_userID: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    //! ......................................................
    //! ......................................................

    const newestCacheAt =
      X_TweetData?.[0]?.updatedAt || X_TweetData?.[0]?.createdAt || null;
    const cacheAgeMs = newestCacheAt
      ? Date.now() - new Date(newestCacheAt).getTime()
      : null;
    const isCacheFresh =
      typeof cacheAgeMs === "number" &&
      cacheAgeMs >= 0 &&
      cacheAgeMs < timeLimit;

    //! ......................................................
    //! ......................................................

    if (X_TweetData && X_TweetData.length && isCacheFresh) {
      return {
        data: X_TweetData.map((tweet) => mapTweetForResponse(tweet)),
        meta: buildMetaFromTweets(X_TweetData),
        source: "cache",
      };
    }
  }

  //! ......................................................
  //! ......................................................

  try {
    //! ......................................................
    //! ......................................................

    const response = await X_API.get(`/users/${xUserId}/tweets`, {
      params: {
        max_results: limit,
        exclude: "replies,retweets",
        "tweet.fields": "created_at,public_metrics,lang,display_text_range",
      },
    });

    //! ......................................................
    //! ......................................................

    const apiTweets = response?.data?.data || [];
    const apiMeta = response?.data?.meta || null;

    //! ......................................................
    //! ......................................................

    if (!apiTweets.length) {
      return {
        data: [],
        meta: apiMeta || buildMetaFromTweets([]),
      };
    }

    //! ......................................................
    //! ......................................................

    const cacheWrites = apiTweets.map((tweet) => ({
      updateOne: {
        filter: { X_TweetID: tweet.id },
        update: { $set: mapTweetForCache(tweet, userId) },
        upsert: true,
      },
    }));

    //! ......................................................
    //! ......................................................

    await XTweet.bulkWrite(cacheWrites, { ordered: false });

    //! ......................................................
    //! ......................................................

    return {
      data: apiTweets.map((tweet) => mapTweetForResponse(tweet)),
      meta: apiMeta || buildMetaFromTweets(apiTweets),
      source: "x_api",
    };
  } catch (err) {
    //! ......................................................
    //! ......................................................

    const status = err.response?.status;

    //! ......................................................
    //! ......................................................

    if (X_TweetData.length) {
      return {
        data: X_TweetData.map((tweet) => mapTweetForResponse(tweet)),
        meta: buildMetaFromTweets(X_TweetData),
        source: "cache_fallback",
      };
    }

    //! ......................................................
    //! ......................................................

    if (status === 429) {
      const reset = err.response?.headers["x-rate-limit-reset"];

      throw {
        status: 429,
        message: "X API rate limit exceeded",
        resetAt: reset ? Number(reset) * 1000 : null,
      };
    }

    //! ......................................................
    //! ......................................................

    throw {
      status: status || 500,
      message: "Failed to fetch user tweets",
      details: err.response?.data || err.message,
    };
  }
}

//! ......................................................
//! ......................................................

module.exports = {
  getUserTweets,
};
