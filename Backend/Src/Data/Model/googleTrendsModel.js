const mongoose = require("mongoose");

const TrendSignalSchema = new mongoose.Schema(
  {
    keyword: { type: String, index: true },
    geo: { type: String, index: true },
    timestamp: { type: Date, index: true },
    value: Number, // 0–100
    source: { type: String }, // google_trends
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrendSignal", TrendSignalSchema);
