const xUserService = require("../../../Service/V1/X_User");
const xTweetService = require("../../../Service/V1/X_Tweet");

async function X_getIdByUserName(req, res) {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username parameter is required" });
  }

  try {
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

    // ! here

    console.log(userResult);

    const theId = await xTweetService.getUserTweets({
      xUserId: userResult?.data?.X_ID,
      MongoUserId: userResult?.data?._id,
    });

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
