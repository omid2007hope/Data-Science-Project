const { X_GetTweetLimit } = require("../../../Config/X_Config");

const X_API = require("./X_API");

async function getTweet(xUserId) {
  const response = await X_API.get(`/users/${xUserId}/tweets`, {
    params: {
      max_results: X_GetTweetLimit,
      exclude: "replies,retweets",
      "tweet.fields": "created_at,public_metrics,lang,display_text_range",
    },
  });

  const apiTweets = response?.data?.data || [];
  const apiMeta = response?.data?.meta || null;

  if (!apiTweets.length) {
    return null;
  }

  return { apiTweets, apiMeta };
}
module.exports = {
  getTweet,
};
