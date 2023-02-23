/**
 * SmartMirror GUI API
 * This contains the API for the SmartMirror GUI which
 * is used to update the GUI with the latest data.
 */
"use strict";
const express = require("express");
const app = express();
const path = require("path");
// multer not needed for now

const fs = require("fs");

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

app.use("/", express.static(path.join(__dirname, "/static")));
const PORT = process.env.PORT || 8080;
app.listen(PORT);
