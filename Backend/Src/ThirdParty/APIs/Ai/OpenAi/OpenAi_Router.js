const express = require("express");
const router = express.Router();

const openAiController = require("./OpenAi_Controller");

router.post("/tweet/analyze", openAiController.analyzeTweet);
router.post("/tweet/analyze/from-db", openAiController.analyzeFromDb);

module.exports = router;
