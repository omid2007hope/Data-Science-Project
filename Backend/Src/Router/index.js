const express = require("express");
const router = express.Router();

const userRouter = require("../ThirdParty/APIs/X/userRouter");
const googleTrendsRouter = require("../ThirdParty/APIs/GoogleTrends/googleTrendsRouter");
const aiRouter = require("../ThirdParty/APIs/Ai/OpenAi/OpenAi_Router");

// Health
router.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

// X API
router.use("/x", userRouter);

router.use("/ai", aiRouter);

router.use("/google", googleTrendsRouter);

module.exports = router;
