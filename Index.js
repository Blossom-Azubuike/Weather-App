const form = document.getElementById('weather-form');
const input = document.getElementById('location-input');
const result = document.getElementById('weather-result');
const geoBtn = document.getElementById('geo-btn');
const speechBtn = document.getElementById('speech-btn');
const toggleThemeBtn = document.getElementById('toggle-theme');

// Replace with your actual API key
const API_KEY = 'f1c6cdb9c63024c0d4bb22dd52f93f41';

// Fetch weather data by city name or zip
async function fetchWeather(query) {
  result.innerHTML = 'Loading...';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    result.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Fetch weather data by geolocation
async function fetchWeatherByCoords(lat, lon) {
  result.innerHTML = 'Loading...';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('Location error');
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    result.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Display weather data
function displayWeather(data) {
  const { name } = data;
  const { temp } = data.main;
  const { description, icon } = data.weather[0];

  result.innerHTML = `
    <h2>${name}</h2>
    <p><strong>${temp}°C</strong></p>
    <p>${description}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" />
  `;
}

// Form submit
form.addEventListener('submit', e => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) fetchWeather(query);
});

// Geolocation button
geoBtn.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => result.innerHTML = '<p style="color:red;">Geolocation permission denied.</p>'
    );
  } else {
    result.innerHTML = '<p style="color:red;">Geolocation not supported.</p>';
  }
});

// Speech input
speechBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported.');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const spoken = event.results[0][0].transcript;
    input.value = spoken;
    fetchWeather(spoken);
  };

  recognition.onerror = () => {
    result.innerHTML = '<p style="color:red;">Speech recognition failed.</p>';
  };

  recognition.start();
});

// Dark mode toggle
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleThemeBtn.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';
});
