const jwt = require("jsonwebtoken");
const userDB = require("../Models/userModels");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authorization header missing. User must be logged in...",
      logout: true,
    });
  }

  let withoutBearer = token.split(" ")[1];
  if (!withoutBearer) {
    return res.status(401).json({
      message: "Bearer token missing. User must be logged in...",
    });
  }
  try {
    const payload = jwt.verify(withoutBearer, "nothing");
    console.log("id", payload.id);
    const user = await userDB.findById(payload.id);

    // console.log("user", user);
    if (!user) {
      return res.status(401).json({
        message: "Invalid user. User must be logged in...",
      });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid token or token expired. User must be logged in...",
    });
  }
};

module.exports = verifyToken;
