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
// import axios from 'axios';
// import WeatherService from './WeatherService';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

// // Gemini AI response function
// const fetchAIResponse = async (
//   message,
//   imageData = null,
//   mimeType = 'image/png',
// ) => {
//   try {
//     const contents = imageData
//       ? [
//           {
//             role: 'user',
//             parts: [
//               { text: message },
//               {
//                 inlineData: {
//                   data: imageData.split(',')[1],
//                   mimeType: mimeType,
//                 },
//               },
//             ],
//           },
//         ]
//       : [{ role: 'user', parts: [{ text: message }] }];

//     const result = await model.generateContent({ contents });
//     return (
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "I couldn't generate a response."
//     );
//   } catch (error) {
//     console.error('Error fetching AI response:', error);
//     throw error;
//   }
// };

// export const sendMessageToAI = async (
//   message,
//   chatId,
//   previousMessages = [],
//   imageData = null,
// ) => {
//   try {
//     // Check if message is a weather query
//     const weatherMatch = checkWeatherQuery(message);
//     if (weatherMatch) {
//       return await handleWeatherQuery(weatherMatch, message);
//     }

//     // Prepare conversation history for context
//     const conversationHistory = previousMessages.map((msg) => ({
//       role: msg.sender === 'User' ? 'user' : 'model',
//       parts: [{ text: msg.text }],
//     }));

//     // Build the prompt with system instructions
//     const systemPrompt = `
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

// Current conversation context:
// ${conversationHistory
//   .slice(-10)
//   .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
//   .join('\n')}
//     `.trim();

//     // Use Gemini AI with the system prompt prepended to the message
//     const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

//     const aiResponse = await fetchAIResponse(fullMessage, imageData);
//     return aiResponse;
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

// // Export the fetchAIResponse function if needed elsewhere
// export { fetchAIResponse };

// ///////////////////////////////////deployment issues////////////////////
// import axios from 'axios';
// import WeatherService from './WeatherService';

// // Remove the static import - we'll use dynamic imports instead
// let genAI = null;
// let model = null;

// // Initialize AI only when needed
// const initializeAI = async () => {
//   if (!genAI) {
//     const { GoogleGenerativeAI } = await import('@google/generative-ai');
//     genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
//     model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
//   }
//   return model;
// };

// // Weather command patterns
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

// // Gemini AI response function
// const fetchAIResponse = async (
//   message,
//   imageData = null,
//   mimeType = 'image/png',
// ) => {
//   try {
//     const aiModel = await initializeAI();

//     const contents = imageData
//       ? [
//           {
//             role: 'user',
//             parts: [
//               { text: message },
//               {
//                 inlineData: {
//                   data: imageData.split(',')[1],
//                   mimeType: mimeType,
//                 },
//               },
//             ],
//           },
//         ]
//       : [{ role: 'user', parts: [{ text: message }] }];

//     const result = await aiModel.generateContent({ contents });
//     return (
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "I couldn't generate a response."
//     );
//   } catch (error) {
//     console.error('Error fetching AI response:', error);
//     throw error;
//   }
// };

// export const sendMessageToAI = async (
//   message,
//   chatId,
//   previousMessages = [],
//   imageData = null,
// ) => {
//   try {
//     // Check if message is a weather query
//     const weatherMatch = checkWeatherQuery(message);
//     if (weatherMatch) {
//       return await handleWeatherQuery(weatherMatch, message);
//     }

//     // Prepare conversation history for context
//     const conversationHistory = previousMessages.map((msg) => ({
//       role: msg.sender === 'User' ? 'user' : 'model',
//       parts: [{ text: msg.text }],
//     }));

//     // Build the prompt with system instructions
//     const systemPrompt = `
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

// Current conversation context:
// ${conversationHistory
//   .slice(-10)
//   .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
//   .join('\n')}
//     `.trim();

//     // Use Gemini AI with the system prompt prepended to the message
//     const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

//     const aiResponse = await fetchAIResponse(fullMessage, imageData);
//     return aiResponse;
//   } catch (error) {
//     console.error('Error in AI service:', error);
//     return 'Sorry, I encountered an error while processing your request. Please try again.';
//   }
// };

// // Check if message contains weather query
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

// // Export the fetchAIResponse function if needed elsewhere
// export { fetchAIResponse };
/////////////////////////////////////////////////
import WeatherService from './WeatherService';

// Remove AI initialization - we'll use a different approach
let aiInitialized = false;
let genAI = null;
let model = null;

// Initialize AI only when needed with proper error handling
const initializeAI = async () => {
  if (aiInitialized && model) {
    return model;
  }

  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('AI service only available in browser environment');
    }

    // Use window global for dynamic import to work in Vercel
    const { GoogleGenerativeAI } = await import(
      'https://esm.run/@google/generative-ai'
    );

    if (!import.meta.env.VITE_API_KEY) {
      throw new Error('Missing API key');
    }

    genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    aiInitialized = true;

    return model;
  } catch (error) {
    console.error('Failed to initialize AI:', error);
    aiInitialized = false;
    throw new Error(`AI service unavailable: ${error.message}`);
  }
};

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

// Alternative: Use a fetch-based approach to Gemini API
const fetchAIDirect = async (message, imageData = null) => {
  try {
    const API_KEY = import.meta.env.VITE_API_KEY;

    if (!API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    };

    // Add image data if provided
    if (imageData) {
      const base64Data = imageData.split(',')[1];
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: 'image/png',
          data: base64Data,
        },
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'AI request failed');
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response."
    );
  } catch (error) {
    console.error('Direct AI fetch error:', error);
    throw error;
  }
};

// Gemini AI response function
const fetchAIResponse = async (
  message,
  imageData = null,
  mimeType = 'image/png',
) => {
  try {
    // Try direct fetch first (more reliable for deployment)
    return await fetchAIDirect(message, imageData);
  } catch (error) {
    console.error('Direct fetch failed, trying SDK:', error);

    // Fallback to SDK if direct fetch fails
    try {
      const aiModel = await initializeAI();

      if (!aiModel) {
        throw new Error('AI model not available');
      }

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

      const result = await aiModel.generateContent({ contents });
      return (
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response. Please try again."
      );
    } catch (sdkError) {
      console.error('Both AI methods failed:', sdkError);
      throw new Error(
        'AI service is currently unavailable. Please try again later.',
      );
    }
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

// Enhanced weather query handler
const handleWeatherQuery = async (weatherMatch, originalMessage) => {
  try {
    let weatherData;

    if (weatherMatch.type === 'current_location') {
      weatherData = await WeatherService.getCurrentLocationWeather();
    } else if (weatherMatch.type === 'specific_city') {
      weatherData = await WeatherService.getWeatherByCity(weatherMatch.city);
    }

    if (!weatherData) {
      throw new Error('No weather data received');
    }

    const weatherString =
      WeatherService.getFormattedWeatherString?.(weatherData) || '';

    return `## 🌤️ Weather Report for ${weatherData.city}, ${weatherData.country}

**Current Conditions:** ${weatherData.icon || '☀️'} *${
      weatherData.description || 'Clear'
    }*

### 📊 Detailed Information:
- **Temperature:** ${weatherData.temperature}°C (feels like ${
      weatherData.feelsLike
    }°C)
- **Humidity:** ${weatherData.humidity}%
- **Wind:** ${weatherData.windSpeed} km/h ${weatherData.windDirection || ''}
- **Pressure:** ${weatherData.pressure} hPa
- **Visibility:** ${weatherData.visibility} km

### 🌅 Additional Details:
- **Sunrise:** ${weatherData.sunrise || 'N/A'}
- **Sunset:** ${weatherData.sunset || 'N/A'}
- **UV Index:** ${weatherData.uvIndex || 'N/A'}

${weatherString}

*Last updated: ${weatherData.lastUpdated || new Date().toLocaleTimeString()}*`;
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

// Main function to send message to AI
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
- Use tables for comparisons
- Separate sections with blank lines

## Comparison Questions
When asked for comparisons, use Markdown tables with relevant features.

## General Guidelines
- Responses must be Markdown-ready
- Be clear and well-structured
- Provide helpful, accurate information

Current conversation context:
${conversationHistory
  .slice(-5) // Reduced context length for better performance
  .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
  .join('\n')}
    `.trim();

    // Use AI with the system prompt prepended to the message
    const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

    const aiResponse = await fetchAIResponse(fullMessage, imageData);
    return aiResponse;
  } catch (error) {
    console.error('Error in AI service:', error);

    if (
      error.message.includes('API key') ||
      error.message.includes('API_KEY') ||
      error.message.includes('Missing API key')
    ) {
      return '## 🔑 Configuration Required\n\nPlease ensure your Gemini AI API key is properly configured in the environment variables.';
    }

    if (
      error.message.includes('quota') ||
      error.message.includes('rate limit')
    ) {
      return '## ⚠️ Service Limit Reached\n\nThe AI service has reached its usage limit. Please try again later or check your API quota.';
    }

    if (error.message.includes('unavailable')) {
      return '## 🔧 Service Temporarily Unavailable\n\nThe AI service is currently unavailable. This might be due to network issues or maintenance. Please try again in a few minutes.';
    }

    return `## ❌ Service Error\n\nSorry, I encountered an error while processing your request: "${error.message}". Please try again later.`;
  }
};

// Export the fetchAIResponse function if needed elsewhere
export { fetchAIResponse };
