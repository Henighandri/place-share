const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Place = require("../models/place-model");
const User = require("../models/user-model");
const fs = require("fs");
/*******************getPlaceById************************ */

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not find a place for the provided id",
      500
    );
    return next(err);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );

    return next(error);
  }
  res.send({ place: place.toObject({ getters: true }) });
};
/*******************getPlacesByUserId************************ */

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not find places for the provided user",
      500
    );
    return next(error);
  }
  if (!userWithPlaces) {
    const error = new HttpError(
      "Could not find  places for the provided user id",
      404
    );

    return next(error);
  }
  res.send({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

/*******************createNewPlace************************ */

const createNewPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new HttpError(
      "Invalid inputs passed , please check your data ",
      422
    );
    return next(err);
  }

  const { title, description, address, creator } = req.body;

  if (req.userData.userId !== creator) {
    const err = new HttpError(
      "Something went wrong ,You are not the creator of this place 77",
      401
    );
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 40.74844474,
      lng: -73.9271516,
    },
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    const err = new HttpError("Creating place failed ,please try again", 500);
    return next(err);
  }
  if (!user) {
    const err = new HttpError("Could not find user for the provided id", 500);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed,please try again.", 500);
    return next(error);
  }
  res.status(201).send({ place: createdPlace.toObject({ getters: true }) });
};

/*******************updatePlaceById************************ */

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new HttpError(
      "Invalid inputs passed , please check your data ",
      422
    );
    return next(err);
  }
  const pid = req.params.pid;
  const { title, description } = req.body.place;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not update place for the provided id",
      500
    );
    return next(err);
  }
  if (!place) {
    const err = new HttpError(
      "Something went wrong ,Could not find place for the provided id",
      404
    );
    return next(err);
  }

  if (req.userData.userId !== place.creator.toString()) {
    const err = new HttpError(
      "Something went wrong ,You are not the creator of this place 77",
      401
    );
    return next(err);
  }

  try {
    await place.updateOne({ title, description });
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not update place for the provided id",
      500
    );
    return next(err);
  }

  res.status(201).send({
    message: "updated place ",
  });
};

/*******************deletePlaceById************************ */

const deletePlaceById = async (req, res, next) => {
  const pid = req.params.pid;

  let place;
  try {
    place = await Place.findById(pid).populate("creator");
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not delete place for the provided id",
      500
    );
    return next(err);
  }
  if (!place) {
    const err = new HttpError(
      "Something went wrong ,Could not find place for the provided id",
      404
    );
    return next(err);
  }

  if (req.userData.userId !== place.creator.id) {
    const err = new HttpError(
      "Something went wrong ,You are not the creator of this place",
      401
    );
    return next(err);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError(
      "Something went wrong ,Could not delete place for the provided id",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).send({
    message: "deleted place",
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createNewPlace = createNewPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
