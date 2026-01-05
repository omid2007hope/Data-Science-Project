const X_API = require("./X_API");
const XTweet = require("../../../Data/Model/X_TweetCache");

// Just normalizing and mapping the tweet data

function normalizePublicMetrics(metrics) {
  return {
    retweet_count: metrics?.retweet_count ?? 0,
    reply_count: metrics?.reply_count ?? 0,
    like_count: metrics?.like_count ?? 0,
    quote_count: metrics?.quote_count ?? 0,
    bookmark_count: metrics?.bookmark_count ?? 0,
    impression_count: metrics?.impression_count ?? 0,
  };
}

function mapTweetForCache(tweet, xUserId) {
  return {
    X_TweetID: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at ? new Date(tweet.created_at) : null,
    lang: tweet.lang,
    display_text_range: tweet.display_text_range || null,
    public_metrics: normalizePublicMetrics(tweet.public_metrics),
    X_userID: xUserId || null,
  };
}

function mapTweetForResponse(tweet) {
  return {
    id: tweet.X_TweetID || tweet.id,
    text: tweet.text,
    created_at: tweet.created_at,
    lang: tweet.lang,
    display_text_range: tweet.display_text_range || null,
    public_metrics: normalizePublicMetrics(tweet.public_metrics),
  };
}

function buildMetaFromTweets(tweets) {
  if (!tweets || tweets.length === 0) {
    return {
      result_count: 0,
      newest_id: null,
      oldest_id: null,
      next_token: null,
    };
  }

  // returning the results

  return {
    result_count: tweets.length,
    newest_id: tweets[0].X_TweetID || tweets[0].id,
    oldest_id:
      tweets[tweets.length - 1].X_TweetID || tweets[tweets.length - 1].id,
    next_token: null,
  };
}

// real stuff down here

async function getUserTweets({ xUserId, limit = 5 }) {
  if (!xUserId) {
    throw new Error("xUserId is required");
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 100);
  let cached = [];

  // 1) CHECK CACHE (latest tweets for this user)
  // here
  if (xUserId) {
    cached = await XTweet.find({ X_userID: xUserId })
      .sort({ created_at: -1 })
      .limit(safeLimit)
      .lean();

    if (cached && cached.length) {
      return {
        data: cached.map((tweet) => mapTweetForResponse(tweet)),
        meta: buildMetaFromTweets(cached),
        source: "cache",
      };
    }
  }

  try {
    // 2) FETCH FROM X API (OFFICIAL ENDPOINT)
    const response = await X_API.get(`/users/${xUserId}/tweets`, {
      params: {
        max_results: safeLimit,
        exclude: "replies,retweets",
        "tweet.fields": "created_at,public_metrics,lang,display_text_range",
      },
    });

    const apiTweets = response?.data?.data || [];
    const apiMeta = response?.data?.meta || null;

    if (!apiTweets.length) {
      return {
        data: [],
        meta: apiMeta || buildMetaFromTweets([]),
      };
    }

    const cacheWrites = apiTweets.map((tweet) => ({
      updateOne: {
        filter: { X_TweetID: tweet.id },
        // here
        update: { $set: mapTweetForCache(tweet, xUserId) },
        upsert: true,
      },
    }));

    // 3) UPSERT (SAFE FOR CACHING)
    await XTweet.bulkWrite(cacheWrites, { ordered: false });

    return {
      data: apiTweets.map((tweet) => mapTweetForResponse(tweet)),
      meta: apiMeta || buildMetaFromTweets(apiTweets),
      source: "x_api",
    };
  } catch (err) {
    const status = err.response?.status;

    if (cached.length) {
      return {
        data: cached.map((tweet) => mapTweetForResponse(tweet)),
        meta: buildMetaFromTweets(cached),
        source: "cache_fallback",
      };
    }

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
