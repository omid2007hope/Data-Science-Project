const googleTrends = require("google-trends-api");

async function getInterestOverTime({ keyword, geo = "US", days = 7 }) {
  try {
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const res = await googleTrends.interestOverTime({
      keyword,
      geo,
      startTime,
    });

    const parsed = JSON.parse(res);

    return parsed.default.timelineData.map((item) => ({
      keyword,
      geo,
      timestamp: new Date(Number(item.time) * 1000),
      value: item.value[0], // 0–100
      formattedTime: item.formattedTime,
      source: "google_trends",
    }));
  } catch (error) {
    console.error("Google Trends Error | Service", {
      keyword,
      geo,
      message: error.message,
    });
    throw error;
  }
}

module.exports = {
  getInterestOverTime,
};
