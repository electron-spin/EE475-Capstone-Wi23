/**
 * SmartMirror GUI API
 * This contains the API for the SmartMirror GUI which
 * is used to update the GUI with the latest data.
 */
"use strict";
const express = require("express");
const app = express();
const path = require("path");
const {SpotifyManager} = require('./spotifyManager')
// multer not needed for now

const fs = require("fs");

const PORT = process.env.PORT || 8080;

/**
 * Endpoint: /getHandData
 * Type: GET
 * Return format: text
 * Looks in the "../SharedMem.txt" file for the latest hand data
 * and returns it to the client as text.
 */
app.get("/getHandData", (req, res) => {
  let data = fs.readFileSync("../SharedMem.txt", "utf8");
  res.send(data);
});

const spotifyManager = new SpotifyManager(app, PORT);
spotifyManager.initRequestHandlers();

app.use("/", express.static(path.join(__dirname, "/static")));
app.listen(PORT);
console.log(`listening at http://localhost:${PORT}`);
