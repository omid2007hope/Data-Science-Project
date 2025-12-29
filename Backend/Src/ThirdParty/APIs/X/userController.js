const userNameService = require("./userNameService");
const getUserTweets = require("./tweetService");

async function X_getIdByUserName(req, res) {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username parameter is required" });
  }

  try {
    const userResult = await userNameService(username);

    if (!userResult) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log(userResult.data.X_ID);

    if (!userResult || !userResult.data || !userResult.data.X_ID) {
      return res.status(404).json({
        success: false,
        error: "X_ID_NOT_FOUND",
        message: "User exists but has no associated X ID",
      });
    }

    const theId = await getUserTweets(userResult?.data?.X_ID);

    return res.status(200).json(theId);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
}

module.exports = {
  X_getIdByUserName,
};
