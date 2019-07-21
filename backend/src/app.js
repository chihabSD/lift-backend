const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");

//use api v1
const v1 = require("./routes/v1");

const app = express();

// -------- DB Config ------//

// go to process.env and get the mongo url
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// when connection occurs execute the function and
mongoose.connection.on("connected", () => {
  console.log("Connected to database"); //display a message
});

//on error
mongoose.connection.on("error", err => {
  // if there is an error
  console.error(`Failed to connect to database: ${err}`); //display a message
});

// -------- Middlewares------//
app.use(logger("dev"));

//init passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//init body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------- Routes ------//
app.use("/api/v1", v1); // any request fall under the prefix /ai/v2 go to v1 and deal with it

// -------- Eroors ----- //

//Any error happens go to (err in the next fundtion) and handle it
app.use((req, res, next) => {
  //create instance of error and give it a message
  var err = new Error("Page not found");
  err.status = 404; // error has property of 404
  next(err); // next handler
});

// handly any error here
app.use((err, req, res, next) => {
  // pass error status or interneral server error
  const status = err.status || 500;
  const error = err.message || "Error processing your request"; //err.message is coming from new Error object

  res.status(status).send({
    error
  });
});

module.exports = app;
