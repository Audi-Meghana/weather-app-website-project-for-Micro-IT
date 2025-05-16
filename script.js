const apiKey = 'c32be1b9fc48c86239d57e5c98e99573';

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const location = e.target.value.trim();
    if (location) {
      fetchWeather(location);
    }
  }
});

function fetchWeather(location) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert('Location not found');
        return;
      }
      displayCurrentWeather(data);
      fetchFiveDayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(() => alert('Error fetching weather'));
}

function displayCurrentWeather(data) {
  document.querySelector('.current-city').textContent = data.name;
  const date = new Date();
  document.querySelector('.current-date').textContent = date.toDateString();

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const weatherIcon = document.querySelector('.weather-icon');
  weatherIcon.style.backgroundImage = `url(${iconUrl})`;

  document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.querySelector('.condition').textContent = data.weather[0].description;
  document.querySelector('.temp-high').textContent = `${Math.round(data.main.temp_max)}°C`;
  document.querySelector('.temp-low').textContent = `${Math.round(data.main.temp_min)}°C`;
  document.querySelector('.wind-speed').textContent = `${data.wind.speed} km/h`;
  document.querySelector('.humidity').textContent = `${data.main.humidity}%`;

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  document.querySelector('.sunrise').textContent = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.querySelector('.sunset').textContent = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fetchFiveDayForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      displayFiveDayForecast(data);
    });
}

function displayFiveDayForecast(data) {
  const container = document.querySelector('.days-container');
  container.innerHTML = '';

  const dailyData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

  dailyData.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-forecast');
    dayDiv.innerHTML = `
      <div class="date">${dayName}</div>
      <div class="icon" style="background-image:url(${iconUrl})"></div>
      <div class="temp">Temp: ${Math.round(day.main.temp)}°C</div>
      <div class="feel">Feels like: ${Math.round(day.main.feels_like)}°C</div>
      <div class="moist">Humidity: ${day.main.humidity}%</div>
      <div class="condition">${day.weather[0].description}</div>
    `;
    container.appendChild(dayDiv);
  });
}
