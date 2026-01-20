//! ......................................................
//! Importing
const BaseService = require("../BaseService");
const model = require("../../Model/X_Tweet");
const { getTweet } = require("../../ThirdParty/APIs/X/GetTweet");

module.exports = new (class X_Tweet extends BaseService {
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
    //! Check the DataBase

    const cache = await this.model
      .findOne({ X_MongoUserID: MongoUserId })
      .lean();

    //! Data already exist in DataBase --> get it from DataBase

    if (cache) {
      return {
        source: "cache",
        data: cache,
      };
    }

    try {
      //! ......................................................
      //! Reciving the data
      const tweetResponse = await getTweet(xUserId);

      //! ......................................................
      //! simplifying the data

      const apiTweets = tweetResponse?.apiTweets || [];

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
          //! Save the data in the DataBase
          const createObject = await this.createObject(objectStructure);

          //! ......................................................
          //! Return the data
          return {
            source: "x_api",
            data: createObject,
          };
        }),
      );

      //! ......................................................
      //! catch
    } catch (err) {
      //! ......................................................
      //! ......................................................

      const status = err.response?.status;

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
