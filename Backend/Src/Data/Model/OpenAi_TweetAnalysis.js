const mongoose = require("mongoose");

const OpenAiTweetAnalysisSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "XTweet",
    },

    oneSentence: {
      type: String,
    },

    keywords: [String],
  },
  { versionKey: false, timestamps: true }
);

OpenAiTweetAnalysisSchema.index({ oneSentence: 1, keywords: 1 });

module.exports = mongoose.model(
  "OpenAiTweetAnalysis",
  OpenAiTweetAnalysisSchema
);
