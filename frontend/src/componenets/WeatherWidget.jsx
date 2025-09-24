import React, { useState, useEffect } from 'react';
import WeatherService from '../services/WeatherService';

const WeatherWidget = ({ onWeatherData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    // Load current location weather on component mount
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await WeatherService.getCurrentLocationWeather();
      setWeather(weatherData);
      if (onWeatherData) {
        onWeatherData(weatherData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByCity = async (city) => {
    setLoading(true);
    setError('');
    try {
      const weatherData = await WeatherService.getWeatherByCity(city);
      setWeather(weatherData);
      if (onWeatherData) {
        onWeatherData(weatherData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      loadWeatherByCity(cityInput.trim());
    }
  };

  if (loading) {
    return (
      <div className="weather-widget bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-300">Loading weather...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget bg-gray-800 rounded-lg p-4 mb-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          ⚠️ {error}
          <button
            onClick={loadCurrentLocationWeather}
            className="ml-2 underline hover:text-red-100"
          >
            Use my location
          </button>
        </div>
      )}

      {weather && (
        <div className="weather-content">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-semibold">
                {weather.city}, {weather.country}
              </h3>
              <p className="text-gray-300 text-sm capitalize">
                {weather.description}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <span className="text-3xl mr-2">{weather.icon}</span>
                <div>
                  <span className="text-2xl font-bold text-white">
                    {weather.temperature}°C
                  </span>
                  <p className="text-gray-400 text-xs">
                    Feels like {weather.feelsLike}°C
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-700/50 rounded">
              <p className="text-gray-400">Humidity</p>
              <p className="text-white font-medium">{weather.humidity}%</p>
            </div>
            <div className="text-center p-2 bg-gray-700/50 rounded">
              <p className="text-gray-400">Wind</p>
              <p className="text-white font-medium">{weather.windSpeed} m/s</p>
            </div>
            <div className="text-center p-2 bg-gray-700/50 rounded">
              <p className="text-gray-400">Visibility</p>
              <p className="text-white font-medium">{weather.visibility} km</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span>🌅 {weather.sunrise}</span>
              </span>
            </div>
            <button
              onClick={loadCurrentLocationWeather}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Refresh
            </button>
            <div className="text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span>🌇 {weather.sunset}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
