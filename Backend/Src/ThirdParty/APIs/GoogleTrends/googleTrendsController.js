const TrendSignal = require("../../../Data/Model/googleTrendsModel");
const { getInterestOverTime } = require("./googleTrendsService");

async function fetchAndStoreTrends(req, res) {
  try {
    const { keyword } = req.params;

    const data = await getInterestOverTime({ keyword });

    const ops = data.map((d) => ({
      updateOne: {
        filter: {
          keyword: d.keyword,
          geo: d.geo,
          timestamp: d.timestamp,
        },
        update: { $setOnInsert: d },
        upsert: true,
      },
    }));

    if (ops.length > 0) {
      await TrendSignal.bulkWrite(ops);
    }

    res.status(200).json({
      keyword,
      stored: ops.length,
    });
  } catch (error) {
    console.error("Google Trends Error | Controller", error.message);
    res.status(500).json({ error: "Google Trends fetch failed" });
  }
}

module.exports = {
  fetchAndStoreTrends,
};
