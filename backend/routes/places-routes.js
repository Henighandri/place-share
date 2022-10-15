const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controller");
const router = express.Router();
const fileUpload = require("../middleware/file-uploade");
const checkAuth = require("../middleware/check-auth");

const validationCreateNewPlace = [
  check("title").trim().not().isEmpty(),
  check("description").isLength({ min: 5 }),
  check("address").not().isEmpty(),
];
const validationUpdatePlaceById = [
  check("place.title").trim().not().isEmpty(),
  check("place.description").isLength({ min: 5 }),
];

router.get("/user/:uid", placesController.getPlacesByUserId);

router.get("/:pid", placesController.getPlaceById);

router.use(checkAuth);

router.delete("/:pid", placesController.deletePlaceById);

router.patch(
  "/:pid",
  validationUpdatePlaceById,
  placesController.updatePlaceById
);

router.post(
  "/",
  fileUpload.single("image"),
  validationCreateNewPlace,
  placesController.createNewPlace
);
module.exports = router;
