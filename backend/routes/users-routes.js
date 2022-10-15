const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-uploade");

const router = express.Router();

const validationCreateUser = [
  check("name").trim().not().isEmpty(),
  check("password").isLength({ min: 8 }),
  check("email").isEmail().normalizeEmail(),
];
const validationlogInUser = [
  check("password").isLength({ min: 8 }),
  check("email").isEmail().normalizeEmail(),
];

/*******************************Router **************************** */

router.get("/", usersController.getAllUser);
router.post(
  "/signup",
  fileUpload.single("image"),
  validationCreateUser,
  usersController.creatUser
);
router.post("/login", validationlogInUser, usersController.logInUser);

module.exports = router;
