const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const err = new HttpError("You are not authorized ", 401);
      throw err;
    }

    const decodedToken = jwt.verify(token, "secretKey");

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    const err = new HttpError("You are not authorized ", 401);
    return next(err);
  }
};
