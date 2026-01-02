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

// Attachments can include media_keys and/or poll_ids (X API)
const AttachmentsSchema = new mongoose.Schema(
  {
    media_keys: [String],
    poll_ids: [String],
  },
  { _id: false }
);

// ======================
// MAIN SCHEMA
// ======================

const XTweetSchema = new mongoose.Schema(
  {
    // Tweet ID
    id: {
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

    // Source (e.g. "Twitter Web App")
    source: String,

    // Display text range [start, end]
    display_text_range: {
      type: [Number],
      validate: (v) => v.length === 2,
    },

    // Attachments (media / polls)
    attachments: AttachmentsSchema,

    // Public metrics
    public_metrics: PublicMetricsSchema,

    // Author reference
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "XUser",
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, // createdAt / updatedAt (DB-level)
  }
);

module.exports = mongoose.model("XTweet", XTweetSchema);
