const model = require("../../Model/X_User");
const BaseService = require("../BaseService");
const X_API = require("../../ThirdParty/APIs/X/X_API");

/**
 * Fetch X user data by username
 * @param {string} username
 * @returns {Object} X user data
 */

module.exports = new (class X_User extends BaseService {
  async userNameService(username) {
    if (!username) {
      throw new Error("Username is required");
    }
    try {
      const cached = await this.findOne({ username }).lean();

      if (cached) {
        return {
          source: "cache",
          data: cached,
        };
      }

      // !.. here

      const { data } = await X_API.get(`/users/by/username/${username}`);

      // !.. here

      const objectStructure = {
        username: username,
        X_ID: data?.data?.id,
        name: data?.data?.name,
      };

      const createObject = await this.create(objectStructure);

      return {
        source: "x_api",
        data: createObject,
      };
    } catch (error) {
      console.error("X API Error | userNameService()", {
        username,
        status: error.response?.status,
        message: error.message,
        apiError: error.response?.data,
      });

      throw error;
    }
  }
})(model);
