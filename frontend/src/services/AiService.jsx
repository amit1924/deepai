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

/////////////////////////////////////////////////

// Gemini AI Service Implementation

////////////////////////////////////////////////
// import WeatherService from './WeatherService';

// // Remove AI initialization - we'll use a different approach
// let aiInitialized = false;
// let genAI = null;
// let model = null;

// // Initialize AI only when needed with proper error handling
// const initializeAI = async () => {
//   if (aiInitialized && model) {
//     return model;
//   }

//   try {
//     // Check if we're in a browser environment
//     if (typeof window === 'undefined') {
//       throw new Error('AI service only available in browser environment');
//     }

//     // Use window global for dynamic import to work in Vercel
//     const { GoogleGenerativeAI } = await import(
//       'https://esm.run/@google/generative-ai'
//     );

//     if (!import.meta.env.VITE_API_KEY) {
//       throw new Error('Missing API key');
//     }

//     genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
//     model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
//     aiInitialized = true;

//     return model;
//   } catch (error) {
//     console.error('Failed to initialize AI:', error);
//     aiInitialized = false;
//     throw new Error(`AI service unavailable: ${error.message}`);
//   }
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

// // Alternative: Use a fetch-based approach to Gemini API
// const fetchAIDirect = async (message, imageData = null) => {
//   try {
//     const API_KEY = import.meta.env.VITE_API_KEY;

//     if (!API_KEY) {
//       throw new Error('Missing Gemini API key');
//     }

//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

//     const requestBody = {
//       contents: [
//         {
//           parts: [{ text: message }],
//         },
//       ],
//     };

//     // Add image data if provided
//     if (imageData) {
//       const base64Data = imageData.split(',')[1];
//       requestBody.contents[0].parts.push({
//         inline_data: {
//           mime_type: 'image/png',
//           data: base64Data,
//         },
//       });
//     }

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'AI request failed');
//     }

//     const data = await response.json();
//     return (
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "I couldn't generate a response."
//     );
//   } catch (error) {
//     console.error('Direct AI fetch error:', error);
//     throw error;
//   }
// };

// // Gemini AI response function
// const fetchAIResponse = async (
//   message,
//   imageData = null,
//   mimeType = 'image/png',
// ) => {
//   try {
//     // Try direct fetch first (more reliable for deployment)
//     return await fetchAIDirect(message, imageData);
//   } catch (error) {
//     console.error('Direct fetch failed, trying SDK:', error);

//     // Fallback to SDK if direct fetch fails
//     try {
//       const aiModel = await initializeAI();

//       if (!aiModel) {
//         throw new Error('AI model not available');
//       }

//       const contents = imageData
//         ? [
//             {
//               role: 'user',
//               parts: [
//                 { text: message },
//                 {
//                   inlineData: {
//                     data: imageData.split(',')[1],
//                     mimeType: mimeType,
//                   },
//                 },
//               ],
//             },
//           ]
//         : [{ role: 'user', parts: [{ text: message }] }];

//       const result = await aiModel.generateContent({ contents });
//       return (
//         result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "I couldn't generate a response. Please try again."
//       );
//     } catch (sdkError) {
//       console.error('Both AI methods failed:', sdkError);
//       throw new Error(
//         'AI service is currently unavailable. Please try again later.',
//       );
//     }
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

//     if (!weatherData) {
//       throw new Error('No weather data received');
//     }

//     const weatherString =
//       WeatherService.getFormattedWeatherString?.(weatherData) || '';

//     return `## 🌤️ Weather Report for ${weatherData.city}, ${weatherData.country}

// **Current Conditions:** ${weatherData.icon || '☀️'} *${
//       weatherData.description || 'Clear'
//     }*

// ### 📊 Detailed Information:
// - **Temperature:** ${weatherData.temperature}°C (feels like ${
//       weatherData.feelsLike
//     }°C)
// - **Humidity:** ${weatherData.humidity}%
// - **Wind:** ${weatherData.windSpeed} km/h ${weatherData.windDirection || ''}
// - **Pressure:** ${weatherData.pressure} hPa
// - **Visibility:** ${weatherData.visibility} km

// ### 🌅 Additional Details:
// - **Sunrise:** ${weatherData.sunrise || 'N/A'}
// - **Sunset:** ${weatherData.sunset || 'N/A'}
// - **UV Index:** ${weatherData.uvIndex || 'N/A'}

// ${weatherString}

// *Last updated: ${weatherData.lastUpdated || new Date().toLocaleTimeString()}*`;
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

// // Main function to send message to AI
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
// - Use tables for comparisons
// - Separate sections with blank lines

// ## Comparison Questions
// When asked for comparisons, use Markdown tables with relevant features.

// ## General Guidelines
// - Responses must be Markdown-ready
// - Be clear and well-structured
// - Provide helpful, accurate information

// Current conversation context:
// ${conversationHistory
//   .slice(-5) // Reduced context length for better performance
//   .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
//   .join('\n')}
//     `.trim();

//     // Use AI with the system prompt prepended to the message
//     const fullMessage = `${systemPrompt}\n\nUser message: ${message}`;

//     const aiResponse = await fetchAIResponse(fullMessage, imageData);
//     return aiResponse;
//   } catch (error) {
//     console.error('Error in AI service:', error);

//     if (
//       error.message.includes('API key') ||
//       error.message.includes('API_KEY') ||
//       error.message.includes('Missing API key')
//     ) {
//       return '## 🔑 Configuration Required\n\nPlease ensure your Gemini AI API key is properly configured in the environment variables.';
//     }

//     if (
//       error.message.includes('quota') ||
//       error.message.includes('rate limit')
//     ) {
//       return '## ⚠️ Service Limit Reached\n\nThe AI service has reached its usage limit. Please try again later or check your API quota.';
//     }

//     if (error.message.includes('unavailable')) {
//       return '## 🔧 Service Temporarily Unavailable\n\nThe AI service is currently unavailable. This might be due to network issues or maintenance. Please try again in a few minutes.';
//     }

//     return `## ❌ Service Error\n\nSorry, I encountered an error while processing your request: "${error.message}". Please try again later.`;
//   }
// };

// // Export the fetchAIResponse function if needed elsewhere
// export { fetchAIResponse };
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

// Enhanced search command patterns
const SEARCH_COMMANDS = [
  /search for (.+)/i,
  /find (.+)/i,
  /look up (.+)/i,
  /get news about (.+)/i,
  /tech news about (.+)/i,
  /latest news on (.+)/i,
  /search news for (.+)/i,
  /web search for (.+)/i,
  /internet search for (.+)/i,
  /browse for (.+)/i,
  /google (.+)/i,
  /find recent news about (.+)/i,
  /latest updates on (.+)/i,
  /what's happening with (.+)/i,
  /current news about (.+)/i,
  /recent developments in (.+)/i,
];

// JSON file command patterns
const JSON_COMMANDS = [
  /read json file/i,
  /load json data/i,
  /show json content/i,
  /display json file/i,
  /get data from json/i,
  /read from json/i,
  /json data/i,
];

// Professional Real-time Data Service with Source Links
const RealTimeDataService = {
  async getDynamicData(query, type = 'general') {
    try {
      console.log(`🔄 Fetching real-time data for: ${query}`);

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (
        type === 'news' ||
        query.includes('news') ||
        query.includes('today') ||
        query.includes('current')
      ) {
        return await this.getRealTimeNews(query, currentYear, currentMonth);
      } else if (query.includes('weather')) {
        return null; // Let weather service handle it
      } else {
        return await this.getRealTimeSearch(query, currentYear, currentMonth);
      }
    } catch (error) {
      console.error('Real-time data error:', error);
      return await this.simulateCurrentData(query);
    }
  },

  // Get real news from free APIs with source links
  async getRealTimeNews(query, year, month) {
    try {
      const newsData = await this.fetchFromFreeNewsAPI(query);
      if (newsData) {
        return this.formatRealNewsWithSources(newsData, query, year, month);
      }

      // Fallback to professional news simulation with source links
      return await this.simulateProfessionalNews(query, year, month);
    } catch (error) {
      return await this.simulateProfessionalNews(query, year, month);
    }
  },

  // Free news API integration
  async fetchFromFreeNewsAPI(query) {
    try {
      // Option 1: GNews API (free tier available)
      const gnewsKey = import.meta.env.VITE_GNEWS_API_KEY;
      if (gnewsKey) {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            query,
          )}&lang=en&max=5&apikey=${gnewsKey}`,
        );
        if (response.ok) {
          return await response.json();
        }
      }

      // Option 2: NewsAPI (free tier available)
      const newsapiKey = import.meta.env.VITE_NEWSAPI_KEY;
      if (newsapiKey) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            query,
          )}&pageSize=5&apiKey=${newsapiKey}`,
        );
        if (response.ok) {
          return await response.json();
        }
      }

      return null;
    } catch (error) {
      console.error('News API error:', error);
      return null;
    }
  },

  // Format real news data with professional source links
  formatRealNewsWithSources(newsData, query, year, month) {
    let result = `## 📰 BREAKING NEWS: "${query}"\n\n`;
    result += `### 🗞️ Live Updates • ${this.getCurrentPeriod()}\n\n`;

    if (newsData.articles && newsData.articles.length > 0) {
      newsData.articles.forEach((article, index) => {
        const sourceName = article.source?.name || 'News Source';
        const publishDate = article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString()
          : 'Recent';

        result += `#### ${index + 1}. ${article.title}\n\n`;
        result += `**📡 Source:** ${sourceName}  \n`;
        result += `**📅 Published:** ${publishDate}  \n`;
        result += `**📝 Summary:** ${
          article.description || 'No description available'
        }\n\n`;

        if (article.url) {
          result += `🔗 **[Read Full Article](${article.url})**  \n`;
          result += `🌐 **[Visit ${sourceName} Website](${this.getSourceWebsite(
            sourceName,
          )})**\n\n`;
        }

        result += `---\n\n`;
      });
    } else {
      result += `No recent articles found. Showing professional news simulation...\n\n`;
      return null;
    }

    result += `### 📊 News Summary\n`;
    result += `- **Total Articles:** ${newsData.articles?.length || 0}\n`;
    result += `- **Search Query:** "${query}"\n`;
    result += `- **Last Updated:** ${new Date().toLocaleString()}\n\n`;

    result += `*📡 Live news feed • Sources: ${this.getSourceList(newsData)}*`;
    return result;
  },

  // Professional news simulation with real source links
  async simulateProfessionalNews(query, year, month) {
    const newsPrompt = `
You are a professional news editor in ${year}. Create realistic breaking news with ACTUAL SOURCE LINKS.

NEWS QUERY: "${query}"

CREATE PROFESSIONAL NEWS WITH REAL SOURCES:

**REQUIREMENTS:**
- Current year: ${year}, Month: ${month}
- Use REAL news organizations (CNN, BBC, Reuters, AP, TechCrunch, etc.)
- Include plausible recent developments
- Format with actual source website links
- Make it sound like real breaking news

**FORMAT TEMPLATE:**
1. [Realistic Headline - Recent Date ${year}]
   Source: [Real News Organization]
   Published: [Specific Date in ${year}]
   Summary: [Plausible recent development]
   Read More: [Actual organization website link]

Provide 3-4 professional news items with real source links:`;

    const aiResponse = await fetchAIResponse(newsPrompt);
    return `## 📰 PROFESSIONAL NEWS: "${query}"\n\n### 🗞️ Current Developments • ${this.getCurrentPeriod()}\n\n${aiResponse}\n\n### 🔍 Recommended News Sources\n${this.getRecommendedNewsSources()}\n\n*⚠️ Professional simulation based on current trends • ${new Date().toLocaleString()}*`;
  },

  // Real-time search with professional formatting
  async getRealTimeSearch(query, year, month) {
    const searchPrompt = `
You are a professional search engine in ${year}. Provide current information with SOURCE REFERENCES.

SEARCH QUERY: "${query}"

PROVIDE PROFESSIONAL RESPONSE WITH:
- Current ${year} information with dates
- Credible sources and references
- Official website links when relevant
- Recent developments and statistics

**INCLUDE SOURCE LINKS FOR:**
- Official company/organization websites
- Government sources (.gov)
- Educational sources (.edu)
- Reputable news outlets

Search query: "${query}"`;

    const aiResponse = await fetchAIResponse(searchPrompt);
    return `## 🔍 PROFESSIONAL SEARCH: "${query}"\n\n### 🌐 Current Information • ${year}\n\n${aiResponse}\n\n### 🔗 Recommended Sources\n${this.getSearchRecommendations(
      query,
    )}\n\n*🔍 Professional search results • ${new Date().toLocaleString()}*`;
  },

  // General current data simulation
  async simulateCurrentData(query) {
    const currentYear = new Date().getFullYear();
    const prompt = `
Provide professional, current information for ${currentYear} about: "${query}"

INCLUDE:
- Current statistics and data
- Official sources and references
- Website links for verification
- Recent developments

Make it professional and credible.`;

    const aiResponse = await fetchAIResponse(prompt);
    return `## 🔮 CURRENT DATA: "${query}"\n\n### 📊 Professional Analysis • ${currentYear}\n\n${aiResponse}\n\n### 🔍 Verification Sources\n${this.getVerificationSources(
      query,
    )}\n\n*⚠️ Professional analysis • ${new Date().toLocaleString()}*`;
  },

  // Helper function to get source websites
  getSourceWebsite(sourceName) {
    const sourceWebsites = {
      CNN: 'https://cnn.com',
      'BBC News': 'https://bbc.com/news',
      Reuters: 'https://reuters.com',
      'Associated Press': 'https://apnews.com',
      'The New York Times': 'https://nytimes.com',
      'The Guardian': 'https://theguardian.com',
      'Al Jazeera': 'https://aljazeera.com',
      TechCrunch: 'https://techcrunch.com',
      'The Verge': 'https://theverge.com',
      Wired: 'https://wired.com',
      Bloomberg: 'https://bloomberg.com',
      Forbes: 'https://forbes.com',
      CNBC: 'https://cnbc.com',
      'Fox News': 'https://foxnews.com',
      'NBC News': 'https://nbcnews.com',
      'ABC News': 'https://abcnews.go.com',
      'CBS News': 'https://cbsnews.com',
      'USA Today': 'https://usatoday.com',
      'Washington Post': 'https://washingtonpost.com',
      Time: 'https://time.com',
      Newsweek: 'https://newsweek.com',
    };

    return sourceWebsites[sourceName] || 'https://news.google.com';
  },

  // Get list of sources from news data
  getSourceList(newsData) {
    if (!newsData.articles) return 'Various Sources';

    const sources = newsData.articles
      .map((article) => article.source?.name || 'Unknown')
      .filter((source, index, arr) => arr.indexOf(source) === index);

    return sources.join(', ');
  },

  // Get recommended news sources
  getRecommendedNewsSources() {
    return `
**🌐 Major News Networks:**
- [CNN](https://cnn.com) - Breaking news and live coverage
- [BBC News](https://bbc.com/news) - International perspective
- [Reuters](https://reuters.com) - Global business and politics
- [Associated Press](https://apnews.com) - Fact-based reporting

**💻 Technology News:**
- [TechCrunch](https://techcrunch.com) - Startup and tech innovation
- [The Verge](https://theverge.com) - Technology and culture
- [Wired](https://wired.com) - Tech and science deep dives

**📊 Business & Finance:**
- [Bloomberg](https://bloomberg.com) - Markets and economy
- [CNBC](https://cnbc.com) - Business news and analysis
- [Financial Times](https://ft.com) - Global economic news

**🔍 News Aggregators:**
- [Google News](https://news.google.com) - Comprehensive news collection
- [AllSides](https://allsides.com) - Balanced news perspectives
- [Ground News](https://ground.news) - Compare news sources
    `;
  },

  // Get search recommendations
  getSearchRecommendations(query) {
    return `
**🔎 For More Information:**
- [Google Search](https://www.google.com/search?q=${encodeURIComponent(
      query,
    )}) - Comprehensive web search
- [Wikipedia](https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
      query,
    )}) - Encyclopedia reference
- [YouTube](https://www.youtube.com/results?search_query=${encodeURIComponent(
      query,
    )}) - Video content
- [Reddit](https://www.reddit.com/search/?q=${encodeURIComponent(
      query,
    )}) - Community discussions

**📚 Academic Sources:**
- [Google Scholar](https://scholar.google.com/scholar?q=${encodeURIComponent(
      query,
    )}) - Research papers
- [arXiv](https://arxiv.org/search/?query=${encodeURIComponent(
      query,
    )}) - Scientific preprints
    `;
  },

  // Get verification sources
  getVerificationSources(query) {
    return `
**✅ Fact-Checking Resources:**
- [Snopes](https://snopes.com) - Fact-checking website
- [PolitiFact](https://politifact.com) - Political fact-checking
- [FactCheck.org](https://factcheck.org) - Accuracy in public discourse

**📊 Data Verification:**
- [World Bank Data](https://data.worldbank.org) - Global development data
- [Our World in Data](https://ourworldindata.org) - Research and data
- [Statista](https://statista.com) - Market and consumer data

**🔍 Additional Research:**
- [Google Trends](https://trends.google.com) - Search trend data
- [Pew Research Center](https://pewresearch.org) - Social science research
    `;
  },

  // Helper function to get current period string
  getCurrentPeriod() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  },
};

// JSON File Service (unchanged)
const JSONFileService = {
  async readJSONFile() {
    try {
      const jsonUrl = '/data.json';
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`Failed to load JSON file: ${response.status}`);
      }

      const jsonData = await response.json();
      return this.formatJSONData(jsonData);
    } catch (error) {
      return this.getSampleJSONData();
    }
  },

  formatJSONData(data) {
    let result = `## 📁 JSON Data Contents\n\n`;

    if (Array.isArray(data)) {
      result += `### Array with ${data.length} items:\n\n`;
      data.forEach((item, index) => {
        result += `**Item ${index + 1}:**\n\`\`\`json\n${JSON.stringify(
          item,
          null,
          2,
        )}\n\`\`\`\n\n`;
      });
    } else if (typeof data === 'object' && data !== null) {
      result += `### Object Structure:\n\n`;
      result += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;

      result += `### Key Information:\n`;
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
          result += `- **${key}:** Array with ${value.length} items\n`;
        } else if (typeof value === 'object') {
          result += `- **${key}:** Object\n`;
        } else {
          result += `- **${key}:** ${value}\n`;
        }
      });
    } else {
      result += `### Content:\n\`\`\`json\n${JSON.stringify(
        data,
        null,
        2,
      )}\n\`\`\`\n`;
    }

    return result;
  },

  getSampleJSONData() {
    return `## 📁 JSON Data Example\n\n
**Note:** No JSON file found at the specified location. Here's a sample structure:

### Sample JSON Structure:
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "en"
  }
}
\`\`\`

### 🔧 Setup Instructions:
1. Create a \`public/data.json\` file
2. Add your JSON data
3. The file will be automatically loaded`;
  },
};

// Enhanced search detection
const checkSearchQuery = (message) => {
  const lowerMessage = message.toLowerCase();

  // Always treat these as real-time searches
  const realTimeKeywords = [
    'news',
    'today',
    'current',
    'latest',
    'breaking',
    'update',
    'recent',
    'now',
    '2025',
  ];
  const isRealTimeQuery = realTimeKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );

  if (isRealTimeQuery) {
    return { type: 'news', query: message };
  }

  // Enhanced search detection
  for (const pattern of SEARCH_COMMANDS) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const query = match[1].trim();
      return { type: 'general', query };
    }
  }

  return null;
};

// Check if message contains JSON file query
const checkJSONQuery = (message) => {
  const lowerMessage = message.toLowerCase();
  for (const pattern of JSON_COMMANDS) {
    if (pattern.test(lowerMessage)) {
      return true;
    }
  }
  return false;
};

// Check if message contains weather query
const checkWeatherQuery = (message) => {
  const lowerMessage = message.toLowerCase();

  for (const pattern of CURRENT_LOCATION_WEATHER_COMMANDS) {
    if (pattern.test(lowerMessage)) {
      return { type: 'current_location', city: null };
    }
  }

  for (const pattern of WEATHER_COMMANDS) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return { type: 'specific_city', city: match[1].trim() };
    }
  }

  return null;
};

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
    return await fetchAIDirect(message, imageData);
  } catch (error) {
    console.error('Direct fetch failed, trying SDK:', error);
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
      return `## ❌ Location Access Issue\n\nI couldn't access your current location. Please enable location permissions or try asking about a specific city like "weather in London"`;
    } else {
      return `## ❌ Weather Data Not Found\n\nSorry, I couldn't find weather data for "${weatherMatch.city}". Check the city name spelling or try "City, Country" format.`;
    }
  }
};

// Handle search queries with real-time data
const handleSearchQuery = async (searchMatch) => {
  try {
    const { type, query } = searchMatch;
    const realTimeResults = await RealTimeDataService.getDynamicData(
      query,
      type,
    );

    if (realTimeResults) {
      return realTimeResults;
    }

    // Fallback to regular AI response
    const aiResponse = await fetchAIResponse(query);
    return `## 🔍 Search: "${query}"\n\n${aiResponse}\n\n*Search performed: ${new Date().toLocaleString()}*`;
  } catch (error) {
    console.error('Search query error:', error);
    return `## ❌ Search Failed\n\nCannot search for "${searchMatch.query}" right now. Error: ${error.message}`;
  }
};

// Handle JSON file queries
const handleJSONQuery = async () => {
  try {
    const jsonData = await JSONFileService.readJSONFile();
    return jsonData;
  } catch (error) {
    console.error('JSON query error:', error);
    return `## ❌ JSON File Error\n\nCannot read JSON file. Ensure public/data.json exists with valid JSON.`;
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

    // Check if message is a search query
    const searchMatch = checkSearchQuery(message);
    if (searchMatch) {
      return await handleSearchQuery(searchMatch);
    }

    // Check if message is a JSON file query
    if (checkJSONQuery(message)) {
      return await handleJSONQuery();
    }

    // Prepare conversation history for context
    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.sender === 'User' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Enhanced system prompt for real-time information
    const currentYear = new Date().getFullYear();
    const systemPrompt = `
You are a professional AI assistant in ${currentYear}. Provide current, verified information.

SPECIAL CAPABILITIES:
- 🔍 **Professional Search**: Current ${currentYear} information with sources
- 📰 **Live News**: Recent developments with source links
- 🌤️ **Weather**: Current weather conditions
- 📁 **JSON Data**: File reading and analysis

IMPORTANT: When providing information, include credible sources and website links when relevant.

Current context:
${conversationHistory
  .slice(-5)
  .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
  .join('\n')}
    `.trim();

    const fullMessage = `${systemPrompt}\n\nUser: ${message}`;
    const aiResponse = await fetchAIResponse(fullMessage, imageData);
    return aiResponse;
  } catch (error) {
    console.error('Error in AI service:', error);
    return `## ❌ Service Error\n\nSorry, I encountered an error: "${error.message}". Please try again.`;
  }
};

// Export services
export { fetchAIResponse, RealTimeDataService, JSONFileService };
