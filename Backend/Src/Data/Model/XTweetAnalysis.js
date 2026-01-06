const mongoose = require("mongoose");

const XTweetAnalysisSchema = new mongoose.Schema(
  {
    XTweet: {
      type: mongoose.Schema.ObjectId,
      ref: "XTweet",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
    },

    oneSentence: {
      type: String,
      required: true,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("XTweetAnalysis", XTweetAnalysisSchema);
