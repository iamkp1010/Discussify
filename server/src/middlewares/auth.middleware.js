const jwt = require("jsonwebtoken");
const UserModel = require("../models/users.model");

const verifyToken = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;
    if (!token) throw new Error("No token provided");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new Error("Invalid Access Token");
    req.user = user;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
};

const optionallyVerifyToken = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;

    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) throw new Error("Invalid Access Token");
    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err.message });
  }
};

module.exports = { verifyToken, optionallyVerifyToken };
