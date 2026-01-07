const mongoose = require("mongoose");

// ======================
// SUB-SCHEMAS
// ======================

const PublicMetricsSchema = new mongoose.Schema(
  {
    retweet_count: Number,
    reply_count: Number,
    like_count: Number,
    quote_count: Number,
    bookmark_count: Number,
    impression_count: Number,
  },
  { _id: false }
);

// ======================
// MAIN SCHEMA
// ======================

const XTweetSchema = new mongoose.Schema(
  {
    // Tweet ID
    X_TweetID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Tweet text
    text: {
      type: String,
      required: true,
    },

    // Creation time
    created_at: {
      type: Date,
      index: true,
    },

    // Language
    lang: String,

    // Display text range [start, end]
    display_text_range: {
      type: [Number],
      validate: (v) => !v || v.length === 2,
    },

    // Public metrics
    public_metrics: PublicMetricsSchema,

    // Author reference
    X_MongoUserID: {
      type: mongoose.Schema.ObjectId,
      ref: "XUser",
    },
  },
  {
    versionKey: false,
    timestamps: true, // createdAt / updatedAt (DB-level)
  }
);

module.exports = mongoose.model("XTweet", XTweetSchema);
