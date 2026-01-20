//! ......................................................
//! Importing
const { X_GetTweetLimit } = require("../../Config/X_Config");
const BaseService = require("../BaseService");
const model = require("../../Model/X_Tweet");
const { getTweet } = require("../../ThirdParty/APIs/X/GetTweet");

//! ......................................................
//! I don't know what it does

const buildMetaFromTweets = (tweets) => ({
  result_count: Array.isArray(tweets) ? tweets.length : 0,
});
module.exports = new (class X_Tweet extends BaseService {
  //! ......................................................
  //! Check the DataBase using MongoUserId(ObjectId)
  async checkTweetCache({ MongoUserId }) {
    const X_TweetData = await this.model
      .find({ X_MongoUserID: MongoUserId })
      .sort({ created_at: -1 })
      .limit(X_GetTweetLimit)
      .lean();

    //! ......................................................
    //! If TweetData already exist in DataBase -> get it from DataBase

    if (X_TweetData && X_TweetData.length) {
      return {
        data: X_TweetData,
        meta: buildMetaFromTweets(X_TweetData),
        source: "cache",
      };
    }
  }

  //! ......................................................
  //! Reciving the Ids
  //! ......................................................

  async getUserTweets({ xUserId, MongoUserId }) {
    //! ......................................................
    //! Console logs
    console.log("From X_Tweet.js(Service) - xUserId", xUserId);
    console.log("From X_Tweet.js(Service) - MongoUserId", MongoUserId);

    //! ......................................................
    //! Throw an error if xUserId dose not exist

    if (!xUserId) {
      throw new Error("xUserId is required");
    }

    //! ......................................................
    //! Pass the MongoUserId(objectId) to checkTweetCache function
    if (MongoUserId) {
      const cacheResult = await this.checkTweetCache({ MongoUserId });
      if (cacheResult) {
        return cacheResult;
      }
    }

    //! ......................................................
    //! ......................................................

    try {
      //! ......................................................
      //! Reciving the data
      const tweetResponse = await getTweet(xUserId);

      //! ......................................................
      //! simplifying the data

      const apiTweets = tweetResponse?.apiTweets || [];
      const apiMeta = tweetResponse?.apiMeta || null;

      //! ......................................................
      //! Console log

      console.log(
        "From X_Tweet.js(Service) - tweetResponse.apiTweets",
        apiTweets,
      );

      //! ......................................................
      //! Return the Data

      if (!apiTweets.length) {
        return {
          data: [],
          meta: apiMeta || buildMetaFromTweets([]),
          source: "x_api",
        };
      }

      //! ......................................................
      //! There might be a bug down here

      const createdTweets = await Promise.all(
        apiTweets.map(async (tweet) => {
          //! ......................................................
          //! Build the data structure

          const objectStructure = {
            X_TweetID: tweet.id,
            text: tweet.text,
            created_at: tweet.created_at ? new Date(tweet.created_at) : null,
            lang: tweet.lang || "",
            display_text_range: tweet.display_text_range || [0, 0],
            public_metrics: {
              retweet_count: tweet.public_metrics?.retweet_count || 0,
              reply_count: tweet.public_metrics?.reply_count || 0,
              like_count: tweet.public_metrics?.like_count || 0,
              quote_count: tweet.public_metrics?.quote_count || 0,
              bookmark_count: tweet.public_metrics?.bookmark_count || 0,
              impression_count: tweet.public_metrics?.impression_count || 0,
            },
            X_MongoUserID: MongoUserId || null,
            X_UserID: xUserId || null,
          };

          //! ......................................................
          //! Check similar ids to avoid duplications

          const existingTweet = await this.model.findOne({
            X_TweetID: tweet.id,
          });

          //! ......................................................
          //! Update the data if Ids were similar

          if (existingTweet) {
            await this.model.updateOne(
              { _id: existingTweet._id },
              { $set: objectStructure },
            );

            //! ......................................................
            //! Return the data

            return this.model.findById(existingTweet._id);
          }

          //! ......................................................
          //! ......................................................

          try {
            //! ......................................................
            //! Save the data in the DataBase
            const createObject = await this.createObject(objectStructure);
            return createObject;

            //! ......................................................
            //! ......................................................
          } catch (createErr) {
            if (createErr?.code === 11000) {
              return this.model.findOne({ X_TweetID: tweet.id });
            }

            //! ......................................................
            //! ......................................................

            throw createErr;
          }
        }),
      );

      //! ......................................................
      //! ......................................................

      return {
        data: createdTweets.filter(Boolean),
        meta: apiMeta || buildMetaFromTweets(createdTweets.filter(Boolean)),
        source: "x_api",
      };

      //! ......................................................
      //! ......................................................
    } catch (err) {
      //! ......................................................
      //! ......................................................

      const status = err.response?.status;

      //! ......................................................
      //! ......................................................

      if (MongoUserId) {
        const cacheFallback = await this.checkTweetCache({ MongoUserId });
        if (cacheFallback) {
          return { ...cacheFallback, source: "cache_fallback" };
        }
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
})(model);
