export function renderCurrentWeather(data, container) {
  const { name, main, weather, wind } = data;
  container.innerHTML = `
    <h2>${name}</h2>
    <div class="temp">${Math.round(main.temp)}°C</div>
    <p class="desc">${weather[0].description.toUpperCase()}</p>
    <div class="details">
      <p>Humidity: ${main.humidity}%</p>
      <p>Wind: ${wind.speed} m/s</p>
    </div>
  `;
}

export function renderForecast(forecastData, container) {
  container.innerHTML = "<h3>5-Day Forecast</h3><div class='forecast-list'></div>";
  const listContainer = container.querySelector(".forecast-list");

  const dailyData = forecastData.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h4>${date}</h4>
      <p>${Math.round(day.main.temp)}°C</p>
      <p>${day.weather[0].main}</p>
    `;
    listContainer.appendChild(card);
  });
}

export function showStatus(message, isError = false) {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? "#e74c3c" : "#2ecc71";
}
