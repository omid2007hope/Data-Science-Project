const express = require("express");
const router = express.Router();

const userRouter = require("../ThirdParty/APIs/X/userRouter");
const googleTrendsRouter = require("../ThirdParty/APIs/GoogleTrends/googleTrendsRouter");

// Health
router.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

// X API
router.use("/x", userRouter);

router.use("/google", googleTrendsRouter);

module.exports = router;
