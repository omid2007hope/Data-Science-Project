const mongoose = require("mongoose");

const XTweetSchema = new mongoose.Schema(
  {
    // Tweet ID (X API: id)
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Tweet text (X API: text)
    text: {
      type: String,
      required: true,
    },

    // Tweet creation time (X API: created_at)
    created_at: {
      type: Date,
      required: true,
      index: true,
    },

    // Tweet language (X API: lang)
    lang: {
      type: String,
      index: true,
    },

    // Public engagement metrics (X API: public_metrics)
    public_metrics: {
      like_count: {
        type: Number,
        required: true,
      },
      retweet_count: {
        type: Number,
        required: true,
      },
      reply_count: {
        type: Number,
        required: true,
      },
      quote_count: {
        type: Number,
        required: true,
      },
    },

    // Author reference (not embedded by X, but REQUIRED for storage)
    author_id: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, // DB timestamps, NOT from X
  }
);

module.exports = mongoose.model("XTweet", XTweetSchema);
