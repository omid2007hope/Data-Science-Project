require("dotenv").config();
const axios = require("axios");

// ======================
// OpenAi API CLIENT
// ======================

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

const openAI_API = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

module.exports = openAI_API;
