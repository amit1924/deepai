// import axios from 'axios';
// import WeatherService from './WeatherService';

// // Weather command patterns (keep your existing patterns)
// const WEATHER_COMMANDS = [
//   /weather in (.+)/i,
//   /what's the weather in (.+)/i,
//   /how's weather in (.+)/i,
//   /temperature in (.+)/i,
//   /weather forecast in (.+)/i,
//   /current weather in (.+)/i,
//   /how is weather in (.+)/i,
//   /what is weather in (.+)/i,
//   /tell me weather in (.+)/i,
// ];

// const CURRENT_LOCATION_WEATHER_COMMANDS = [
//   /current location weather/i,
//   /weather here/i,
//   /local weather/i,
//   /weather at my location/i,
//   /what's the weather like here/i,
//   /how's weather here/i,
//   /current weather/i,
//   /weather now/i,
//   /what's the weather/i,
// ];

// export const sendMessageToAI = async (
//   message,
//   chatId,
//   previousMessages = [],
// ) => {
//   try {
//     // Check if message is a weather query
//     const weatherMatch = checkWeatherQuery(message);
//     if (weatherMatch) {
//       return await handleWeatherQuery(weatherMatch, message);
//     }

//     // Prepare conversation history for context
//     const conversationHistory = previousMessages.map((msg) => ({
//       role: msg.sender === 'User' ? 'user' : 'assistant',
//       content: msg.text,
//     }));

//     const res = await axios.post(
//       'https://text.pollinations.ai/',
//       {
//         messages: [
//           {
//             role: 'system',
//             content: `
// You are a thoughtful and knowledgeable AI assistant.

// ## Response Formatting Rules
// - Use headings (#, ##, ###) for sections
// - Use bullet points (- or *) for lists
// - Use **bold** for emphasis
// - Use \`inline code\` and \`\`\`code blocks\`\`\`
// - Use > for blockquotes
// - Use tables (| column | column |) for any comparison or list with multiple items
// - Separate sections with blank lines

// ## Comparison Questions
// Whenever the user asks for a comparison (e.g., Python vs Java, Java vs C++):
// - Present the comparison in a **Markdown table**
// - Include features like Syntax, Typing, Performance, Use Cases, etc.
// - Add extra notes in bullet points below the table if necessary
// - Make the table concise, clear, and readable
// - Ensure proper spacing and headings

// ## General Guidelines
// - Responses must be Markdown-ready
// - Be mobile-friendly, clear, and well-structured
// - Use at least 4-5 sentences per reply
//         `,
//           },
//           ...conversationHistory.slice(-10),
//           {
//             role: 'user',
//             content: message,
//           },
//         ],
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     return (
//       res.data || 'I apologize, but I encountered an issue. Please try again.'
//     );
//   } catch (error) {
//     console.error('Error in AI service:', error);
//     return 'Sorry, I encountered an error while processing your request. Please try again.';
//   }
// };

// // Check if message contains weather query (keep your existing function)
// const checkWeatherQuery = (message) => {
//   const lowerMessage = message.toLowerCase();

//   // Check for current location weather
//   for (const pattern of CURRENT_LOCATION_WEATHER_COMMANDS) {
//     if (pattern.test(lowerMessage)) {
//       return { type: 'current_location', city: null };
//     }
//   }

//   // Check for specific city weather
//   for (const pattern of WEATHER_COMMANDS) {
//     const match = message.match(pattern);
//     if (match && match[1]) {
//       return { type: 'specific_city', city: match[1].trim() };
//     }
//   }

//   return null;
// };

// // Enhanced weather query handler
// const handleWeatherQuery = async (weatherMatch, originalMessage) => {
//   try {
//     let weatherData;

//     if (weatherMatch.type === 'current_location') {
//       weatherData = await WeatherService.getCurrentLocationWeather();
//     } else if (weatherMatch.type === 'specific_city') {
//       weatherData = await WeatherService.getWeatherByCity(weatherMatch.city);
//     }

//     const weatherString = WeatherService.getFormattedWeatherString(weatherData);

//     return `## 🌤️ Weather Report for ${weatherData.city}, ${weatherData.country}

// **Current Conditions:** ${weatherData.icon} *${weatherData.description}*

// ### 📊 Detailed Information:
// - **Temperature:** ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
// - **Humidity:** ${weatherData.humidity}%
// - **Wind:** ${weatherData.windSpeed} km/h ${weatherData.windDirection}
// - **Pressure:** ${weatherData.pressure} hPa
// - **Visibility:** ${weatherData.visibility} km

// ### 🌅 Additional Details:
// - **Sunrise:** ${weatherData.sunrise}
// - **Sunset:** ${weatherData.sunset}
// - **UV Index:** ${weatherData.uvIndex}

// ${weatherString}

// *Last updated: ${weatherData.lastUpdated}*`;
//   } catch (error) {
//     console.error('Weather query error:', error);

//     if (weatherMatch.type === 'current_location') {
//       return `## ❌ Location Access Issue

// I couldn't access your current location. Please:

// - Enable location permissions in your browser
// - Allow location access for this site
// - Or try asking about a specific city like "weather in London"

// **Alternative:** You can also provide your city name for weather information.`;
//     } else {
//       return `## ❌ Weather Data Not Found

// Sorry, I couldn't find weather data for "${weatherMatch.city}".

// ### 🔍 Troubleshooting Tips:
// - Check if the city name is spelled correctly
// - Try using the format "City, Country"
// - Ensure the city exists and is supported

// **Example:** "weather in London, UK" or "temperature in New York"`;
//     }
//   }
// };

///////////////////////////GEMINI AI ////////////////////////////
import axios from 'axios';
import WeatherService from './WeatherService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Weather command patterns (keep your existing patterns)
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

// Gemini AI response function
const fetchAIResponse = async (
  message,
  imageData = null,
  mimeType = 'image/png',
) => {
  try {
    const contents = imageData
      ? [
          {
            role: 'user',
            parts: [
              { text: message },
              {
                inlineData: {
                  data: imageData.split(',')[1],
                  mimeType: mimeType,
                },
              },
            ],
          },
        ]
      : [{ role: 'user', parts: [{ text: message }] }];

    const result = await model.generateContent({ contents });
    return (
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response."
    );
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw error;
  }
};

export const sendMessageToAI = async (
  message,
  chatId,
  previousMessages = [],
  imageData = null,
) => {
  try {
    // Check if message is a weather query
    const weatherMatch = checkWeatherQuery(message);
    if (weatherMatch) {
      return await handleWeatherQuery(weatherMatch, message);
    }

    // Prepare conversation history for context
    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.sender === 'User' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Build the prompt with system instructions
    const systemPrompt = `
You are a thoughtful and knowledgeable AI assistant.

## Response Formatting Rules
- Use headings (#, ##, ###) for sections
- Use bullet points (- or *) for lists
- Use **bold** for emphasis
- Use \`inline code\` and \`\`\`code blocks\`\`\`
- Use > for blockquotes
- Use tables (| column | column |) for any comparison or list with multiple items
- Separate sections with blank lines

## Comparison Questions
Whenever the user asks for a comparison (e.g., Python vs Java, Java vs C++):
- Present the comparison in a **Markdown table**
- Include features like Syntax, Typing, Performance, Use Cases, etc.
- Add extra notes in bullet points below the table if necessary
- Make the table concise, clear, and readable
- Ensure proper spacing and headings

## General Guidelines
- Responses must be Markdown-ready
- Be mobile-friendly, clear, and well-structured
- Use at least 4-5 sentences per reply

Current conversation context:
${conversationHistory
  .slice(-10)
  .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
  .join('\n')}
    `.trim();

    // Use Gemini AI with the system prompt prepended to the message
    const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

    const aiResponse = await fetchAIResponse(fullMessage, imageData);
    return aiResponse;
  } catch (error) {
    console.error('Error in AI service:', error);
    return 'Sorry, I encountered an error while processing your request. Please try again.';
  }
};

// Check if message contains weather query (keep your existing function)
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

// Enhanced weather query handler
const handleWeatherQuery = async (weatherMatch, originalMessage) => {
  try {
    let weatherData;

    if (weatherMatch.type === 'current_location') {
      weatherData = await WeatherService.getCurrentLocationWeather();
    } else if (weatherMatch.type === 'specific_city') {
      weatherData = await WeatherService.getWeatherByCity(weatherMatch.city);
    }

    const weatherString = WeatherService.getFormattedWeatherString(weatherData);

    return `## 🌤️ Weather Report for ${weatherData.city}, ${weatherData.country}

**Current Conditions:** ${weatherData.icon} *${weatherData.description}*

### 📊 Detailed Information:
- **Temperature:** ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- **Humidity:** ${weatherData.humidity}%
- **Wind:** ${weatherData.windSpeed} km/h ${weatherData.windDirection}
- **Pressure:** ${weatherData.pressure} hPa
- **Visibility:** ${weatherData.visibility} km

### 🌅 Additional Details:
- **Sunrise:** ${weatherData.sunrise}
- **Sunset:** ${weatherData.sunset}
- **UV Index:** ${weatherData.uvIndex}

${weatherString}

*Last updated: ${weatherData.lastUpdated}*`;
  } catch (error) {
    console.error('Weather query error:', error);

    if (weatherMatch.type === 'current_location') {
      return `## ❌ Location Access Issue

I couldn't access your current location. Please:

- Enable location permissions in your browser
- Allow location access for this site
- Or try asking about a specific city like "weather in London"

**Alternative:** You can also provide your city name for weather information.`;
    } else {
      return `## ❌ Weather Data Not Found

Sorry, I couldn't find weather data for "${weatherMatch.city}".

### 🔍 Troubleshooting Tips:
- Check if the city name is spelled correctly
- Try using the format "City, Country" 
- Ensure the city exists and is supported

**Example:** "weather in London, UK" or "temperature in New York"`;
    }
  }
};

// Export the fetchAIResponse function if needed elsewhere
export { fetchAIResponse };
