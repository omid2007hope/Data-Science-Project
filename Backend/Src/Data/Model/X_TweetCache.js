const mongoose = require("mongoose");

const ContextDomainSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
  },
  { _id: false }
);

const ContextEntitySchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
  },
  { _id: false }
);

const ContextAnnotationSchema = new mongoose.Schema(
  {
    domain: ContextDomainSchema,
    entity: ContextEntitySchema,
  },
  { _id: false }
);

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

const XTweetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    text: String,
    created_at: Date,
    lang: String,
    edit_history_tweet_ids: [String],
    context_annotations: [ContextAnnotationSchema],
    public_metrics: PublicMetricsSchema,
    author_id: {
      type: String,
      index: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("XTweet", XTweetSchema);
