const API_KEY = '37acc46646715d87002d2f94f7389db2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather icon mapping
export const WEATHER_ICONS = {
  // Clear
  '01d': '☀️', // Clear sky day
  '01n': '🌙', // Clear sky night

  // Clouds
  '02d': '⛅', // Few clouds day
  '02n': '☁️', // Few clouds night
  '03d': '☁️', // Scattered clouds
  '03n': '☁️', // Scattered clouds
  '04d': '☁️', // Broken clouds
  '04n': '☁️', // Broken clouds

  // Rain
  '09d': '🌧️', // Shower rain
  '09n': '🌧️', // Shower rain
  '10d': '🌦️', // Rain day
  '10n': '🌦️', // Rain night
  '11d': '⛈️', // Thunderstorm
  '11n': '⛈️', // Thunderstorm

  // Snow
  '13d': '❄️', // Snow
  '13n': '❄️', // Snow

  // Mist
  '50d': '🌫️', // Mist
  '50n': '🌫️', // Mist
};

class WeatherService {
  // Get weather by city name
  async getWeatherByCity(cityName) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(
          cityName,
        )}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        throw new Error(`Weather data not found for city: ${cityName}`);
      }

      const data = await response.json();
      return this._formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Get weather by coordinates
  async getWeatherByCoords(latitude, longitude) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        throw new Error('Weather data not available for this location');
      }

      const data = await response.json();
      return this._formatWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Get user's current location weather
  async getCurrentLocationWeather() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weather = await this.getWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
            );
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        },
      );
    });
  }

  // Format weather data for AI response
  _formatWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: this._getWindDirection(data.wind.deg),
      description: data.weather[0].description,
      icon: WEATHER_ICONS[data.weather[0].icon] || '🌈',
      iconCode: data.weather[0].icon,
      visibility: (data.visibility / 1000).toFixed(1),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  // Convert wind degrees to direction
  _getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  // Get formatted weather string for AI
  getFormattedWeatherString(weatherData) {
    return `Weather in ${weatherData.city}, ${weatherData.country}: ${weatherData.temperature}°C, ${weatherData.description}. Feels like ${weatherData.feelsLike}°C. Humidity: ${weatherData.humidity}%. Wind: ${weatherData.windSpeed} m/s ${weatherData.windDirection}.`;
  }
}

export default new WeatherService();
