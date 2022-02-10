require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai").expect;
const cors = require("cors");
const router = express.Router();
const path = require("path");

const fccTestingRoutes = require("./routes/fcctesting.js");
const apiRoutes = require("./routes/api.js");
const runner = require("./test-runner");

const app = express();

// app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", express.static(__dirname + "/api"));
app.use("/public", express.static(__dirname + "/public"));
//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
