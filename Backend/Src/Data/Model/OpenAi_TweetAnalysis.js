const mongoose = require("mongoose");

const OpenAiTweetAnalysisSchema = new mongoose.Schema(
  {
    X_TweetID: {
      type: String,
      index: true,
    },

    X_userID: {
      type: mongoose.Schema.ObjectId,
      ref: "XUser",
      index: true,
    },

    input_text: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    output_text: String,
    one_sentence: String,
    keywords: [String],
    response_id: String,
    source: { type: String, default: "openai" },
    raw_response: mongoose.Schema.Types.Mixed,
  },
  { versionKey: false, timestamps: true }
);

OpenAiTweetAnalysisSchema.index({ X_TweetID: 1, model: 1 });
OpenAiTweetAnalysisSchema.index({ input_text: 1, model: 1 });

module.exports = mongoose.model(
  "OpenAiTweetAnalysis",
  OpenAiTweetAnalysisSchema
);
