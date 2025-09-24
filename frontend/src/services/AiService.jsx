import axios from 'axios';
import WeatherService from './WeatherService';

// Weather command patterns
const WEATHER_COMMANDS = [
  /weather in (.+)/i,
  /what's the weather in (.+)/i,
  /how's weather in (.+)/i,
  /temperature in (.+)/i,
  /weather forecast in (.+)/i,
  /current weather in (.+)/i,
  /how is weather in (.+)/i,
  /what is weather in (.+)/i,
  /tell me weather in (.+)/i,
];

const CURRENT_LOCATION_WEATHER_COMMANDS = [
  /current location weather/i,
  /weather here/i,
  /local weather/i,
  /weather at my location/i,
  /what's the weather like here/i,
  /how's weather here/i,
  /current weather/i,
  /weather now/i,
  /what's the weather/i,
];

export const sendMessageToAI = async (
  message,
  chatId,
  previousMessages = [],
) => {
  try {
    // Check if message is a weather query
    const weatherMatch = checkWeatherQuery(message);
    if (weatherMatch) {
      return await handleWeatherQuery(weatherMatch, message);
    }

    // Prepare conversation history for context
    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.sender === 'User' ? 'user' : 'assistant',
      content: msg.text,
    }));

    const res = await axios.post(
      'https://text.pollinations.ai/',
      {
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant with access to weather information. 
            If users ask about weather, you can provide current weather data.
            Keep responses concise and helpful.`,
          },
          ...conversationHistory.slice(-10),
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return (
      res.data || 'I apologize, but I encountered an issue. Please try again.'
    );
  } catch (error) {
    console.error('Error in AI service:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again.';
  }
};

// Check if message contains weather query
const checkWeatherQuery = (message) => {
  const lowerMessage = message.toLowerCase();

  // Check for current location weather
  for (const pattern of CURRENT_LOCATION_WEATHER_COMMANDS) {
    if (pattern.test(lowerMessage)) {
      return { type: 'current_location', city: null };
    }
  }

  // Check for specific city weather
  for (const pattern of WEATHER_COMMANDS) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return { type: 'specific_city', city: match[1].trim() };
    }
  }

  return null;
};

// Handle weather queries
const handleWeatherQuery = async (weatherMatch, originalMessage) => {
  try {
    let weatherData;

    if (weatherMatch.type === 'current_location') {
      weatherData = await WeatherService.getCurrentLocationWeather();
    } else if (weatherMatch.type === 'specific_city') {
      weatherData = await WeatherService.getWeatherByCity(weatherMatch.city);
    }

    const weatherString = WeatherService.getFormattedWeatherString(weatherData);

    return `Here's the current weather information:\n\n${weatherString}\n\n${weatherData.icon} *${weatherData.description}* in ${weatherData.city}, ${weatherData.country}`;
  } catch (error) {
    console.error('Weather query error:', error);

    if (weatherMatch.type === 'current_location') {
      return "I couldn't access your current location. Please make sure location permissions are enabled, or try asking about weather in a specific city like 'weather in London'.";
    } else {
      return `Sorry, I couldn't find weather data for "${weatherMatch.city}". Please check the city name and try again. You can also ask about weather in your current location by saying "current weather" or "weather here".`;
    }
  }
};
