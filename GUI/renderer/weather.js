import { makeRequest } from './apiFunctions.js';

const WEATHER_ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=47.61&longitude=-122.33&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&timezone=America%2FLos_Angeles&hourly=precipitation";

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