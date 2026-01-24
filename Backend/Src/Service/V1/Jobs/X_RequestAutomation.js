const BaseService = require("../../BaseService");
const model = require("../../../Model/X_RequestQuota");
const cron = require("node-cron");
const xUserService = require("../X_User");
const xTweetService = require("../X_Tweet");

//! ......................................................
//! Setting default values
const DEFAULT_LIMIT = 100;

//! ......................................................
//! Defining default timezone
const DEFAULT_TZ = "UTC";

module.exports = new (class X_RequestAutomation extends BaseService {
  //! Returns UTC year-month: "YYYY-MM"
  getMonthKey(date = new Date()) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  //! ......................................................
  //! Build quota object structure
  //! Ensure quota doc exists and keep limit in sync
  ensureQuotaDoc(monthKey, limit) {
    return this.model.findOneAndUpdate(
      { monthKey },
      { $setOnInsert: { monthKey, limit, used: 0 }, $set: { limit } },
      { new: true, upsert: true },
    );
  }

  //! ......................................................
  //! Consume one unit of quota if available
  consumeQuota(monthKey) {
    return this.model.findOneAndUpdate(
      { monthKey, $expr: { $lt: ["$used", "$limit"] } },
      { $inc: { used: 1 } },
      { new: true },
    );
  }

  //! ......................................................
  //! Parse usernames from env
  parseUsernames() {
    return (process.env.X_USERNAMES || "")
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
  }

  //! ......................................................
  //! Main job runner
  async runJob() {
    //! ......................................................
    //! Collect usernames
    const usernames = this.parseUsernames();
    if (!usernames.length) {
      console.log("[X Scheduler] No usernames configured (X_USERNAMES).");
      return;
    }

    //! ......................................................
    //! Prepare month key and quota
    const monthKey = this.getMonthKey();
    const limit = Number(process.env.X_MONTHLY_QUOTA || DEFAULT_LIMIT);

    await this.ensureQuotaDoc(monthKey, limit);

    //! ......................................................
    //! Process each username
    for (const username of usernames) {
      const quotaDoc = await this.consumeQuota(monthKey);
      if (!quotaDoc) {
        console.log("[X Scheduler] Monthly quota reached. Skipping.");
        return;
      }

      try {
        //! ......................................................
        //! Fetch user and then tweets
        const userResult = await xUserService.userNameService(username);

        if (!userResult?.data?.X_ID || !userResult?.data?._id) {
          console.log("[X Scheduler] Missing X_ID for username:", username);
          continue;
        }

        await xTweetService.getUserTweets({
          xUserId: userResult.data.X_ID,
          MongoUserId: userResult.data._id,
          force: true,
        });
      } catch (err) {
        console.error("[X Scheduler] Failed for username:", username, err);
      }
    }
  }

  //! ......................................................
  //! Start cron schedules
  startScheduler() {
    const tz = process.env.X_SCHEDULE_TZ || DEFAULT_TZ;

    cron.schedule("0 0 * * *", () => this.runJob(), { timezone: tz });
    cron.schedule("0 12 * * *", () => this.runJob(), { timezone: tz });
    cron.schedule("0 18 * * *", () => this.runJob(), { timezone: tz });

    console.log("[X Scheduler] Running at 00:00, 12:00, 18:00", tz);
  }

  //! ......................................................
  //! Entrypoint from other modules
  RequestAutomation() {
    this.startScheduler();
  }
})(model);
