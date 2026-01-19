//! This service has currently no problem and runs without any problem
//! This service has currently no problem and runs without any problem

const model = require("../../Model/X_User");
const BaseService = require("../BaseService");
const X_API = require("../../ThirdParty/APIs/X/X_API");

//! ......................................................
//! ......................................................

/**
 * !Fetch X user data by username
 * @param {string} username
 * @returns {Object} X user data
 */

//! ......................................................
//! ......................................................

module.exports = new (class X_User extends BaseService {
  //! ......................................................
  //! Reciving the username || example (elonmusk)

  async userNameService(username) {
    //! ......................................................
    //! ......................................................
    if (!username) {
      throw new Error("Username is required");
    }
    try {
      //! ......................................................
      //! Check if username already exist in DataBase or not

      const cached = await this.model.findOne({ username: username }).lean();

      //! ......................................................
      //! If the username already exist in the DataBase -> get it from the DataBase

      if (cached) {
        return {
          source: "cache",
          data: cached,
        };
      }

      //! ......................................................
      //! If not -> get it directly from the API

      const { data } = await X_API.get(`/users/by/username/${username}`);

      //! ......................................................
      //! Build the data structure

      const objectStructure = {
        username: username,
        X_ID: data?.data?.id,
        name: data?.data?.name,
      };

      //! ......................................................
      //! Save it in the DataBase

      const createObject = await this.createObject(objectStructure);

      //! Return the Data
      //! ......................................................

      return {
        source: "x_api",
        data: createObject,
      };

      //! ......................................................
      //! Catch error
    } catch (error) {
      console.error("X API Error | userNameService()", {
        username,
        status: error.response?.status,
        message: error.message,
        apiError: error.response?.data,
      });

      //! ......................................................
      //! ......................................................

      throw error;
    }
  }

  //! ......................................................
  //! ......................................................
})(model);
