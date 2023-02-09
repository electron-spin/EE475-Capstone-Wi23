("use strict");
import { makeRequest } from "./apiFunctions.js";

const WEATHER_ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=47.61&longitude=-122.33&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=ms&precipitation_unit=inch&timezone=America%2FLos_Angeles&hourly=precipitation";

(function () {
  window.addEventListener("load", init);

  async function init() {
    let weatherData = await getWeatherData();
    let temp = weatherData.current_weather.temperature;

    let currentHour = new Date().getHours();
    let precipitationLevel = weatherData.hourly.precipitation[currentHour];

    setDate();

    changeWeather(temp, precipitationLevel);

    setInterval(() => {
      // set time
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let timeElement = document.getElementById("time");
      timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  function changeWeather(temp, precipitationLevel) {
    let tempElement = document.getElementById("temp");
    tempElement.textContent = temp + "°F";
    let precipitationElement = document.getElementById("precipitation");
    precipitationElement.textContent = precipitationLevel + " inches of rain";
  }

  const setDate = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let dateElement = document.getElementById("date");
    dateElement.textContent = month + "/" + day + "/" + year;
  };

  async function getWeatherData() {
    let weatherData = await makeRequest(WEATHER_ENDPOINT);
    return weatherData;
  }
})();
