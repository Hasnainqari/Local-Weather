document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "YOUR_API_KEY"; // Replace with your API key if needed
  const apiUrl = "https://weather-proxy.freecodecamp.rocks/";

  const locationElem = document.getElementById("location");
  const weatherIconElem = document.getElementById("weather-icon");
  const temperatureElem = document.getElementById("temperature");
  const toggleButton = document.getElementById("toggle-unit");

  let isCelsius = true;
  let currentTemp = null;

  function fetchWeather(lat, lon) {
    fetch(`${apiUrl}weather?lat=${lat}&lon=${lon}`)
      .then((response) => response.json())
      .then((data) => {
        const { name } = data;
        const { main, weather } = data;
        const { temp } = main;
        const { icon } = weather[0];

        locationElem.textContent = name;
        currentTemp = temp;
        updateTemperature(temp);
        updateWeatherIcon(icon);
        updateBackground(icon);
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  }

  function updateTemperature(temp) {
    if (isCelsius) {
      temperatureElem.textContent = `${Math.round(temp - 273.15)}°C`;
      toggleButton.textContent = "Toggle to °F";
    } else {
      temperatureElem.textContent = `${Math.round(
        ((temp - 273.15) * 9) / 5 + 32
      )}°F`;
      toggleButton.textContent = "Toggle to °C";
    }
  }

  function updateWeatherIcon(icon) {
    weatherIconElem.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">`;
  }

  function updateBackground(icon) {
    const weatherConditions = {
      "01d": "sunny",
      "01n": "clear-night",
      "02d": "partly-cloudy-day",
      "02n": "partly-cloudy-night",
      // Add other conditions as needed
    };

    document.body.style.backgroundImage = `url('images/${
      weatherConditions[icon] || "default"
    }.jpg')`;
  }

  function toggleUnit() {
    isCelsius = !isCelsius;
    updateTemperature(currentTemp);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  toggleButton.addEventListener("click", toggleUnit);
});
