const API_KEY = "4cbf5de203f11b81405852896e96b15d";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 404) throw new Error("City not found!");
        throw new Error(`HTTP Error Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") throw error;
      if (attempt === retries) throw new Error(`Failed after ${retries} attempts: ${error.message}`);
      await delay(backoff);
      backoff *= 2;
    }
  }
}

export async function fetchWeatherData(city, signal) {
  const currentWeatherUrl = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const [currentWeather, forecast] = await Promise.all([
    fetchWithRetry(currentWeatherUrl, { signal }),
    fetchWithRetry(forecastUrl, { signal }),
  ]);

  return { currentWeather, forecast };
}
