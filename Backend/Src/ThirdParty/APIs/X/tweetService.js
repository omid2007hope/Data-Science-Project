const X_API = require("./X_API");
const XTweet = require("../../../Data/Model/X_TweetCache");

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

function mapTweetForCache(tweet, userId) {
  return {
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at ? new Date(tweet.created_at) : null,
    lang: tweet.lang,
    edit_history_tweet_ids: tweet.edit_history_tweet_ids || [],
    context_annotations: tweet.context_annotations || [],
    public_metrics: normalizePublicMetrics(tweet.public_metrics),
    author_id: userId,
  };
}

function mapTweetForResponse(tweet) {
  return {
    id: tweet.id,
    text: tweet.text,
    created_at: tweet.created_at,
    lang: tweet.lang,
    edit_history_tweet_ids: tweet.edit_history_tweet_ids || [],
    context_annotations: tweet.context_annotations || [],
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

  return {
    result_count: tweets.length,
    newest_id: tweets[0].id,
    oldest_id: tweets[tweets.length - 1].id,
    next_token: null,
  };
}

async function getUserTweets(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }

  // 1) CHECK CACHE (latest tweets for this user)
  const cached = await XTweet.find({ author_id: userId })
    .sort({ created_at: -1 })
    .limit(10)
    .lean();

  if (cached && cached.length) {
    return {
      data: cached.map((tweet) => mapTweetForResponse(tweet)),
      meta: buildMetaFromTweets(cached),
    };
  }

  try {
    // 2) FETCH FROM X API (OFFICIAL ENDPOINT)
    const response = await X_API.get(`/users/${userId}/tweets`, {
      params: {
        max_results: 10,
        "tweet.fields":
          "created_at,public_metrics,lang,context_annotations,edit_history_tweet_ids",
        expansions: "attachments.media_keys",
        "media.fields": "url,preview_image_url,type",
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
        filter: { id: tweet.id },
        update: { $set: mapTweetForCache(tweet, userId) },
        upsert: true,
      },
    }));

    // 3) UPSERT (SAFE FOR CACHING)
    await XTweet.bulkWrite(cacheWrites, { ordered: false });

    return {
      data: apiTweets.map((tweet) => mapTweetForResponse(tweet)),
      meta: apiMeta || buildMetaFromTweets(apiTweets),
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
