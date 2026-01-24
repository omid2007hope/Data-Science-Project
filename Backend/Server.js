require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Src/Router");
const connectDB = require("./Src/Data/DB");

//! ......................................................
//! Importing the scheduler

const requestAutomation = require("./Src/Service/V1/Jobs/X_RequestAutomation");

//! ......................................................
//! Prevent cors error

app.use(
  cors({
    origin: "*",
  }),
);

//! ......................................................
//! Request to body stuff

app.use(express.json({ type: "application/json" })); // enables req.body for JSON
app.use(express.urlencoded({ extended: true })); // enables req.body for form submissions

//! ......................................................
//! Main router

app.use("/api", router);

//! ......................................................
//! connecting to the database

connectDB().then(() => {
  //! ......................................................
  //! call and start the scheduler

  requestAutomation.RequestAutomation();

  //! ......................................................
  //! start the server

  app.listen(3000, () => {
    //! ......................................................
    //! log and verify the server status

    console.log("Server running on http://localhost:3000");
  });
});
