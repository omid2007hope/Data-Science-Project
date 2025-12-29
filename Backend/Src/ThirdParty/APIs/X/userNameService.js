const X_API = require("./X_API");
const XUser = require("../../../Data/Model/X_UserCache");

// ======================
// SERVICE
// ======================

/**
 * Fetch X user data by username
 * @param {string} username
 * @returns {Object} X user data
 */
async function userNameService(username) {
  if (!username) {
    throw new Error("Username is required");
  }
  try {
    const cached = await XUser.findOne({ username }).lean();

    if (cached) {
      return {
        source: "cache",
        data: cached,
      };
    }

    const { data } = await X_API.get(`/users/by/username/${username}`);

    const objectStructure = {
      username: username,
      X_ID: data?.data?.id,
      name: data?.data?.name,
    };

    const createObject = await XUser.create(objectStructure);

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

module.exports = userNameService;

// receives the username from the router
// get the data from X API if there is no cache
// saves the data to the database for future requests if there is no cache
