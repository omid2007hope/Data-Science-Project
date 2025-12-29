require("dotenv").config();
const axios = require("axios");

// ======================
// X API CLIENT
// ======================

if (!process.env.X_BEARER_TOKEN) {
  throw new Error("Missing X_BEARER_TOKEN in environment variables");
}

const X_API = axios.create({
  baseURL: "https://api.x.com/2",
  timeout: 30_000, // prevent hanging requests
  headers: {
    Authorization: `Bearer ${process.env.X_BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
});

module.exports = X_API;
