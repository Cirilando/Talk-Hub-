const jwt = require("jsonwebtoken");
// const UserDB = require("../Models/userModels");
const UserModel = require("../Models/userModels");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  const decode =jwt.verify(token, "nothing");

  const user = await UserModel.findById(decode.id).select("-password");

  return user;
};

module.exports = getUserDetailsFromToken;
