import { useState } from 'react';

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

function formatDay(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'short',
  });
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('c');

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`
      );

      if (!geocodeResponse.ok) {
        throw new Error('Unable to look up that city.');
      }

      const geocodeData = await geocodeResponse.json();
      const result = geocodeData.results?.[0];

      if (!result) {
        throw new Error('No city matched your search.');
      }

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
      );

      if (!forecastResponse.ok) {
        throw new Error('Unable to fetch weather data.');
      }

      const forecastData = await forecastResponse.json();
      const current = forecastData.current;
      const daily = forecastData.daily;
      const condition = weatherCodeMap[current.weather_code] ?? 'Unknown conditions';

      const convertedForecast = daily.time.map((day, index) => ({
        day: formatDay(day),
        condition: weatherCodeMap[daily.weather_code[index]] ?? 'Unknown conditions',
        high: Math.round(daily.temperature_2m_max[index]),
        low: Math.round(daily.temperature_2m_min[index]),
      }));

      setWeather({
        city: `${result.name}, ${result.country}`,
        temperature: `${Math.round(current.temperature_2m)}°C`,
        condition,
        forecast: convertedForecast,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function toDisplayTemp(value) {
    if (unit === 'f') {
      return `${Math.round((value * 9) / 5 + 32)}°F`;
    }
    return `${value}°C`;
  }

  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <div>
            <h1>Weather Forecast</h1>
            <p>Enter a city to view today&apos;s current conditions and a 5-day outlook.</p>
          </div>
          <div className="toggle-group" role="group" aria-label="Temperature unit toggle">
            <button
              type="button"
              className={unit === 'c' ? 'toggle active' : 'toggle'}
              onClick={() => setUnit('c')}
            >
              °C
            </button>
            <button
              type="button"
              className={unit === 'f' ? 'toggle active' : 'toggle'}
              onClick={() => setUnit('f')}
            >
              °F
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Try Seattle"
            aria-label="City name"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading…' : 'Check Weather'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {weather ? (
          <div className="result">
            <h2>{weather.city}</h2>
            <p className="temperature">{unit === 'f' ? `${Math.round((Number(weather.temperature.replace('°C', '')) * 9) / 5 + 32)}°F` : weather.temperature}</p>
            <p>{weather.condition}</p>

            <div className="forecast-grid">
              {weather.forecast.map((item) => (
                <div key={item.day} className="forecast-card">
                  <strong>{item.day}</strong>
                  <p>{item.condition}</p>
                  <span>{toDisplayTemp(item.high)} / {toDisplayTemp(item.low)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
