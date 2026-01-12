const {
  X_GetTweetTimeLimit,
  X_GetTweetLimit,
} = require("../../Config/X_Config");

const BaseService = require("../BaseService");

const model = require("../../Model/X_Tweet");

const { getTweet } = require("../../ThirdParty/APIs/X/GetTweet");

module.exports = new (class X_Tweet extends BaseService {
  getTweetTimeLimit(X_TweetData) {
    const newestCacheAt =
      X_TweetData?.[0]?.updatedAt || X_TweetData?.[0]?.createdAt || null;
    const cacheAgeMs = newestCacheAt
      ? Date.now() - new Date(newestCacheAt).getTime()
      : null;
    const isCacheFresh =
      typeof cacheAgeMs === "number" &&
      cacheAgeMs >= 0 &&
      cacheAgeMs < X_GetTweetTimeLimit;

    return isCacheFresh;
  }

  async checkTweetCache({ MongoUserId }) {
    const X_TweetData = await this.model
      .find({ X_MongoUserID: MongoUserId })
      .sort({ created_at: -1 })
      .limit(X_GetTweetLimit)
      .lean();

    const isCacheFresh = this.getTweetTimeLimit(X_TweetData);

    if (X_TweetData && X_TweetData.length && isCacheFresh) {
      return {
        data: X_TweetData.map((tweet) => mapTweetForResponse(tweet)),
        meta: buildMetaFromTweets(X_TweetData),
        source: "cache",
      };
    }
  }

  async getUserTweets({ xUserId, MongoUserId }) {
    if (!xUserId) {
      throw new Error("xUserId is required");
    }

    if (MongoUserId) {
      return this.checkTweetCache();
    }

    try {
      const tweetResponse = await getTweet(xUserId);

      if (!tweetResponse) {
        return {
          data: [],
          meta: apiMeta || buildMetaFromTweets([]),
        };
      }

      const createdTweets = await Promise.all(
        tweetResponse.apiTweets.map(async (tweet) => {
          const objectStructure = {
            X_TweetID: "",
            text: "",
            created_at: null,
            lang: "",
            display_text_range: [0, 0],
            public_metrics: {
              retweet_count: 0,
              reply_count: 0,
              like_count: 0,
              quote_count: 0,
              bookmark_count: 0,
              impression_count: 0,
            },
            X_MongoUserID: null,
          };

          const createObject = await this.createObject(objectStructure);

          return createObject;
        })
      );

      return {
        data: apiTweets.map((tweet) => mapTweetForResponse(tweet)),
        meta: apiMeta || buildMetaFromTweets(apiTweets),
        source: "x_api",
      };
    } catch (err) {
      const status = err.response?.status;

      if (X_TweetData.length) {
        return {
          data: X_TweetData.map((tweet) => mapTweetForResponse(tweet)),
          meta: buildMetaFromTweets(X_TweetData),
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
})(model);
