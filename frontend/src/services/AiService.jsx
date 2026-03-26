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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

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

// Streaming AI response using Gemini API
const streamAIResponse = async (message, onChunk, imageData = null) => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  if (!API_KEY) {
    throw new Error('Missing Gemini API key');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${API_KEY}`;

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

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const jsonStr = line.replace(/^data:\s*/, '');
        const json = JSON.parse(jsonStr);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (text) {
          onChunk(text);
        }
      } catch (err) {
        continue;
      }
    }
  }
};

// Main function to send message to AI (original function - unchanged)
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

// NEW: Streaming version of sendMessageToAI (added without breaking existing code)
export const sendMessageToAIStream = async (
  message,
  chatId,
  previousMessages = [],
  onChunk,
  imageData = null,
) => {
  try {
    // Check if message is a weather query
    const weatherMatch = checkWeatherQuery(message);
    if (weatherMatch) {
      const weatherResponse = await handleWeatherQuery(weatherMatch, message);
      // Stream weather response as chunks
      const words = weatherResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      return;
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
  .slice(-5)
  .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
  .join('\n')}
    `.trim();

    // Use AI with the system prompt prepended to the message
    const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

    // Stream the AI response
    await streamAIResponse(fullMessage, onChunk, imageData);
  } catch (error) {
    console.error('Error in AI streaming service:', error);

    let errorMessage = '';
    if (
      error.message.includes('API key') ||
      error.message.includes('API_KEY') ||
      error.message.includes('Missing API key')
    ) {
      errorMessage = '## 🔑 Configuration Required\n\nPlease ensure your Gemini AI API key is properly configured in the environment variables.';
    } else if (
      error.message.includes('quota') ||
      error.message.includes('rate limit')
    ) {
      errorMessage = '## ⚠️ Service Limit Reached\n\nThe AI service has reached its usage limit. Please try again later or check your API quota.';
    } else if (error.message.includes('unavailable')) {
      errorMessage = '## 🔧 Service Temporarily Unavailable\n\nThe AI service is currently unavailable. This might be due to network issues or maintenance. Please try again in a few minutes.';
    } else {
      errorMessage = `## ❌ Service Error\n\nSorry, I encountered an error while processing your request: "${error.message}". Please try again later.`;
    }

    // Stream the error message
    const words = errorMessage.split(' ');
    for (let i = 0; i < words.length; i++) {
      onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
};

// Export the fetchAIResponse function if needed elsewhere
export { fetchAIResponse };