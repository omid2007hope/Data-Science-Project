const model = require("../../Model/X_User");
const BaseService = require("../BaseService");

module.exports = new (class X_User extends BaseService {})(model);
