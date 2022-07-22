const JWT = require("jsonwebtoken");
const User = require("../models/Users");
const auth = async function (req, res, next) {
  try {
    //const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.session.token;
    if (!token) {
      throw new Error("No tokenAvailable");
    }
    console.log(token);
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      res.status(404).send("User Not Found");
    }
    req.token = token;
    req.user = user;
    console.log("Authenticated");
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};
module.exports = auth;
