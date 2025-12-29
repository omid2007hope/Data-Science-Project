const express = require("express");
const router = express.Router();

const googleTrendsController = require("./googleTrendsController");

router.get("/trends/:keyword", googleTrendsController.fetchAndStoreTrends);

module.exports = router;

// gets the username using req.params
// passses the username to the service
