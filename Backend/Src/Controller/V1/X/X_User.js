const xUserService = require("../../../Service/V1/X_User");
const xTweetService = require("../../../Service/V1/X_Tweet");

async function X_getIdByUserName(req, res) {
  //! Requsting params and getting the username

  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username parameter is required" });
  }

  try {
    //! Sending the username to service || example (elonmusk)

    const userResult = await xUserService.userNameService(username);

    if (!userResult) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userResult || !userResult.data || !userResult.data.X_ID) {
      return res.status(404).json({
        success: false,
        error: "X_ID_NOT_FOUND",
        message: "User exists but has no associated X ID",
      });
    }

    console.log("From X_User.js(Controller) - UserResult", userResult);
    console.log(
      "From X_User.js(Controller) - xUserId: userResult?.data?.X_ID",
      userResult?.data?.X_ID,
    );
    console.log(
      "From X_User.js(Controller) - xUserId: userResult?.data?._id",
      userResult?.data?._id,
    );

    //! HERE HERE HERE
    //! Sending the ids toward TweetService
    const theId = await xTweetService.getUserTweets({
      //! xUserId || for example (44196397)
      xUserId: userResult?.data?.X_ID,

      //! MongoDB ObjectId ||for example (69496a39e80a15703ac57008)
      MongoUserId: userResult?.data?._id,
    });

    console.log("From X_User.js(Controller) - theId", theId);

    return res.status(200).json(theId);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
      details: error.details || null,
    });
  }
}

module.exports = {
  X_getIdByUserName,
};
