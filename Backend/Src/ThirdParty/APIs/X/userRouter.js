const express = require("express");
const router = express.Router();

const userController = require("./userController");

router.get("/user/:username", userController.X_getIdByUserName);

module.exports = router;

// gets the username using req.params
// passses the username to the service
