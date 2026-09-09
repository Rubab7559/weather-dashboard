import { fetchWeatherData } from "./api.js";
import { AsyncQueue } from "./queue.js";
import { renderCurrentWeather, renderForecast, showStatus } from "./ui.js";

const requestQueue = new AsyncQueue(2);
let currentController = null;

const searchBtn = document.getElementById("searchBtn");
const cancelBtn = document.getElementById("cancelBtn");
const cityInput = document.getElementById("cityInput");
const currentWeatherDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");

async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showStatus("Please enter a city name!", true);
    return;
  }

  if (currentController) {
    currentController.abort();
    showStatus("Previous request cancelled. Fetching new data...", false);
  }

  currentController = new AbortController();
  const signal = currentController.signal;

  showStatus(`Queued request for ${city}...`);

  try {
    const data = await requestQueue.add(() => fetchWeatherData(city, signal));
    showStatus("Data fetched successfully!");
    renderCurrentWeather(data.currentWeather, currentWeatherDiv);
    renderForecast(data.forecast, forecastDiv);
  } catch (error) {
    if (error.name === "AbortError") {
      showStatus("Request was aborted by user/new search.", true);
    } else {
      showStatus(error.message, true);
    }
  } finally {
    currentController = null;
  }
}

searchBtn.addEventListener("click", handleSearch);

cancelBtn.addEventListener("click", () => {
  if (currentController) {
    currentController.abort();
    showStatus("Request manually cancelled!", true);
  } else {
    showStatus("No active request to cancel.", true);
  }
});
