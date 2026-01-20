const express = require("express");
const router = express.Router();

const getIdByUserNameController = require("../Controller/V1/X/X_User");

const OpenAiController = require("../Controller/V1/Ai/OpenAi");

// Health
router.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

// X API
router.use("/x/user/:username", getIdByUserNameController.X_getIdByUserName);

router.use("/ai/tweet/analyze", OpenAiController.analyzeTweet);
router.get("/ai/tweet/analyses", OpenAiController.getAllTweetAnalyses);

module.exports = router;
