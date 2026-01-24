const mongoose = require("mongoose");

const XRequestQuotaSchema = new mongoose.Schema(
  {
    monthKey: {
      type: String, // YYYY-MM
      required: true,
      unique: true,
      index: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 100,
    },
    used: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("XRequestQuota", XRequestQuotaSchema);
