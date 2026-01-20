//! ......................................................
//! Importing
const X_API = require("./X_API");

async function getTweet(xUserId) {
  //! ......................................................
  //! Get the Tweets from API by using ID

  const response = await X_API.get(`/users/${xUserId}/tweets`, {
    params: {
      max_results: 5,
      exclude: "replies,retweets",
      "tweet.fields": "created_at,public_metrics,lang,display_text_range",
    },
  });

  //! ......................................................
  //! Console log

  console.log(
    ".................................................................",
  );

  console.log("from GetTweet.js - xUserId", xUserId);

  console.log(
    ".................................................................",
  );

  //! ......................................................
  //! simplifying the data
  const apiTweets = response?.data?.data || [];
  const apiMeta = response?.data?.meta || null;

  //! ......................................................
  //! Console log

  console.log("Directly from GetTweet.js", apiTweets);
  console.log("Directly from GetTweet.js", apiMeta);

  if (!apiTweets.length) {
    return null;
  }

  //! ......................................................
  //!  return the data

  return { apiTweets, apiMeta };
}

//! ......................................................
//! Export the function

module.exports = {
  getTweet,
};
