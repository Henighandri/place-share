const express = require("express");
const fd = require("fs");
const path = require("path");
const HttpError = require("./models/http-error");
const bodyParser = require("body-parser");
const placesRouters = require("./routes/places-routes");
const usersRouters = require("./routes/users-routes");
const mongoose = require("mongoose");
const logger = require("morgan");
var cors = require("cors");
const app = express();

//*****************************MiddleWare ****************** */

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(cors());

//***********************Routes******************* */

app.use("/api/places", placesRouters);
app.use("/api/users", usersRouters);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);

  throw error;
});
app.use((error, req, res, next) => {
  if (req.file) {
    fd.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.send({ message: error.message || "An unknown occurred" });
});

const url =
  "mongodb+srv://heni:heni22091997@cluster0.uhxpi.mongodb.net/mern?retryWrites=true&w=majority";
mongoose
  .connect(url)
  .then(() => {
    app.listen(5000, () => {
      console.log("server started in port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
