require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Src/Router");
const connectDB = require("./Src/Data/DB");

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
//! Start the server

connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
