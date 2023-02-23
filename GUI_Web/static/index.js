("use strict");
import { makeRequest } from "./apiFunctions.js";

const WEATHER_ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=47.61&longitude=-122.33&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&timezone=America%2FLos_Angeles&hourly=precipitation";

const PINCH_THRESHOLD = 25;
// const DEBUG = true;

// const JIN_CURSOR_FILE_PATH = "../SharedMem.txt";
// // "file:///D:/makot/uw/W23/EE475/EE475-Capstone-Wi23/SharedMem.txt";
// const JETSON_CURSOR_FILE_PATH = "FILL_ME_IN";

// const CURSOR_FILE_PATH = DEBUG ? JIN_CURSOR_FILE_PATH : JETSON_CURSOR_FILE_PATH;
// TODO: Have shared memory between hand processor and web gui
//       so the web gui can gain state information about the user's actions
//       and display the correct information
// TODO: Have a cursor that moves around the screen
(function () {
  window.addEventListener("load", init);

  let cursorState = [0, 0, false];

  async function init() {
    //initalize
    setTime();
    setDate();
    updateWeather();

    /**
     * Updated every minute (60,000 milliseconds):
     * - Date
     * - Weather
     */
    setInterval(() => {
      setDate();
      updateWeather();
    }, 60000);

    /**
     * Updated every second (1,000 milliseconds):
     * - Time
     */
    setInterval(() => {
      setTime();
    }, 1000);

    /**
     * Updated every quarter second (250 milliseconds):
     * - Hand Position
     */
    setInterval(() => {
      updateCursorPosition();
      setCursor();
    }, 50);
  }

  /**
   * Sets the cursor position on the web page to the current cursor position.
   * When the hand is not pinched, the cursor is a yellow circle.
   * When the hand is pinched, the cursor is a red circle.
   */
  function setCursor() {
    let cursorElement = document.getElementById("cursor");
    cursorElement.style.left = cursorState[0] + "%";
    cursorElement.style.top = cursorState[1] + "%";

    if (cursorState[2]) {
      console.log("pinched");
      cursorElement.classList.add("pinched");
      cursorElement.classList.remove("unpinched");
    } else {
      console.log("unpinched");
      cursorElement.classList.add("unpinched");
      cursorElement.classList.remove("pinched");
    }
  }

  /**
   * Updates the cursor position state according to values in a text file.
   * Also updated the pinched state.
   */
  async function updateCursorPosition() {
    let fileContents = await readTextFile();
    try {
      cursorState = processFileContents(fileContents);
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  /**
   * Processes the contents of the file and returns the cursor position
   * which is the average position between the thumb and index finger.
   * @param {string} fileContents The contents of the file
   * @returns {Array} An array of 3 values representing the x and y position and the pinch state
   */
  function processFileContents(fileContents) {
    let cursorPositions = [0, 0, false];
    let lines = fileContents.split("\n");
    let thumbs = lines[1].split(" ");
    let thumbX = thumbs[0].split("\t")[2].substring(2);
    let thumbY = thumbs[1].substring(2);

    let indexes = lines[2].split(" ");
    let indexX = indexes[0].split("\t")[2].substring(2);
    let indexY = indexes[1].substring(2);

    cursorPositions[0] = (parseInt(thumbX) + parseInt(indexX)) / 2;
    cursorPositions[1] = (parseInt(thumbY) + parseInt(indexY)) / 2;

    // check if the hand is pinched, distance must be
    let pinched =
      Math.sqrt((thumbX - indexX) ** 2 + (thumbY - indexY) ** 2) <
      PINCH_THRESHOLD;

    // convert cursor position to a percentage of the screen
    // cursor position is 690 x 350
    cursorPositions = [
      Math.round((cursorPositions[0] * 100) / 690),
      Math.round((cursorPositions[1] * 100) / 350),
      pinched
    ];

    return cursorPositions;
  }

  /**
   * Reads a text file and returns the contents of the file
   * @returns {string} The contents of the file
   */
  async function readTextFile() {
    let text = await makeRequest("/getHandData");
    return text;
  }

  /**
   * Updates the weather on the web page with the current weather by
   * making a request to the OpenMeteo Weather API
   * @param {Date} date A date object to get current hour from
   */
  async function updateWeather() {
    let date = new Date();

    let weatherData = await getWeatherData();
    let temp = weatherData.current_weather.temperature;

    let currentHour = date.getHours();
    let precipitationLevel = weatherData.hourly.precipitation[currentHour];

    let tempElement = document.getElementById("temp");
    tempElement.textContent = temp + "°F";
    let precipitationElement = document.getElementById("precipitation");
    precipitationElement.textContent = precipitationLevel + " inches of rain";
  }

  /**
   * Sets the time on the web page
   * @param {Date} date A date object to get current time from
   */
  const setTime = () => {
    let date = new Date();

    // set time
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let timeElement = document.getElementById("time");
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  };

  /**
   * Sets the date on the web page
   * @param {Date} date A date object to get current date from
   */
  const setDate = () => {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let dateElement = document.getElementById("date");
    dateElement.textContent = month + "/" + day + "/" + year;
  };

  async function getWeatherData() {
    let weatherData = await makeRequest(WEATHER_ENDPOINT);
    return weatherData;
  }
})();
