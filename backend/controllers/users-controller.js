const HttpError = require("../models/http-error");
const User = require("../models/user-model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Fetching users failed,please try again.", 500);
    return next(err);
  }
  res.send({ users: users.map((user) => user.toObject({ getters: true })) });
};

/***************************Create User******************** */
const creatUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new HttpError(
      "Invalid inputs passed , please check your data ",
      422
    );
    return next(err);
  }

  const { email, password, name } = req.body;

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create user, please try again ", 500);
    return next(err);
  }

  const newUser = new User({
    email,
    password: hashPassword,
    name,
    image: req.file.path,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    const err = new HttpError("Signing up failed,please try again.", 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretKey",
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    const err = new HttpError("Signing up failed,please try again.", 500);
    return next(err);
  }

  res
    .status(201)
    .send({ user: { ...newUser.toObject({ getters: true }), token } });
};

/***************************logInUser******************** */
const logInUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Invalid inputs passed , please check your data ",
      422
    );
    return next(error);
  }
  console.log(req.body);

  const { email, password } = req.body;
  let existinfUser;
  try {
    existinfUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("login failed,please try again.", 500);
    return next(err);
  }

  if (!existinfUser) {
    const error = new HttpError(
      "Invalid credentiels, could not log you in.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existinfUser.password);
  } catch (err) {
    const error = new HttpError(
      "could not log you in , please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentiels, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existinfUser.id, email: existinfUser.email },
      "secretKey",
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    const err = new HttpError("login failed,please try again.", 500);
    return next(err);
  }

  res.status(200).send({
    user: { ...existinfUser.toObject({ getters: true }), token },
    message: "Logged in",
  });
};

exports.getAllUser = getAllUser;
exports.creatUser = creatUser;
exports.logInUser = logInUser;
