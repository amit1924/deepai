// import React, { useState, useEffect, useRef } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import { sendMessageToAI } from '../services/AiService';
// import TypingDots from '../componenets/TypingDots';
// import MessageRenderer from '../componenets/MessageRenderer';
// import MessageInput from '../componenets/MessageInput';
// import WeatherWidget from '../componenets/WeatherWidget';

// const AiPage = ({ setIsSidebarOpen }) => {
//   const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
//     useChatStore();

//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showWeather, setShowWeather] = useState(false);
//   const [currentWeather, setCurrentWeather] = useState(null);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);

//   // Load messages whenever a chat is selected
//   useEffect(() => {
//     if (activeChat) {
//       fetchMessages(activeChat._id);
//     }
//   }, [activeChat, fetchMessages]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [chatMessages, isLoading]);

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'end',
//       });
//     }, 100);
//   };

//   const handleWeatherData = (weatherData) => {
//     setCurrentWeather(weatherData);
//   };

//   const toggleWeatherWidget = () => {
//     setShowWeather(!showWeather);
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userInput = input;
//     setInput('');
//     setIsLoading(true);

//     try {
//       await sendMessage(activeChat._id, userInput, 'User');
//       const previousMessages = messages;
//       const aiReplyText = await sendMessageToAI(
//         userInput,
//         activeChat._id,
//         previousMessages,
//       );
//       await sendMessage(activeChat._id, aiReplyText, 'AI');
//     } catch (error) {
//       console.error('Error in message flow:', error);
//       addMessage(activeChat._id, {
//         _id: Date.now() + 1,
//         sender: 'AI',
//         text: 'Sorry, I encountered an error. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//       scrollToBottom();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   if (!activeChat) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 safe-area-inset-top mobile-viewport">
//         <div className="text-center">
//           <p className="text-xl mb-4">👋 Welcome to AI Chat!</p>
//           <p>Select or create a chat to start conversation.</p>
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 md:hidden"
//           >
//             Open Chats
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const messages = chatMessages[activeChat._id] || [];

//   return (
//     <div className="flex flex-col h-full bg-gray-900 mobile-viewport">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-700 bg-gray-900 safe-area-inset-top flex-shrink-0">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="md:hidden p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
//             aria-label="Open sidebar"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           </button>

//           <div className="flex-1 min-w-0">
//             <h2 className="text-xl font-bold text-white truncate">
//               {activeChat.name || 'New Chat'}
//             </h2>
//             <p className="text-sm text-gray-400">{messages.length} messages</p>
//           </div>

//           <button
//             onClick={toggleWeatherWidget}
//             className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
//             title="Toggle Weather"
//           >
//             <svg
//               className="w-5 h-5 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Weather Widget */}
//       {showWeather && (
//         <div className="px-4 pt-4 flex-shrink-0">
//           <WeatherWidget onWeatherData={handleWeatherData} />
//         </div>
//       )}

//       {/* Messages Area - This should scroll */}
//       <div
//         ref={messagesContainerRef}
//         className="flex-1 overflow-y-auto mobile-scroll p-4 md:p-6 flex flex-col gap-3"
//       >
//         {messages.length === 0 && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
//             <div className="mb-4 text-6xl animate-pulse">🤖</div>
//             <p className="text-lg font-medium mb-2">Start a conversation</p>
//             <p className="text-sm">I am your AI Assistant. Ask me anything!</p>
//             <p className="text-sm mt-2 text-blue-400">
//               Try asking about weather! 🌤️
//             </p>
//           </div>
//         )}

//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`p-3 rounded-xl max-w-full md:max-w-[80%] ${
//               msg.sender === 'User'
//                 ? 'bg-blue-800 text-white self-end'
//                 : 'bg-gray-800 text-gray-200 self-start'
//             }`}
//           >
//             <div className="flex items-center gap-2 mb-1">
//               <span
//                 className={`text-xs font-medium ${
//                   msg.sender === 'User' ? 'text-blue-200' : 'text-gray-400'
//                 }`}
//               >
//                 {msg.sender}
//               </span>
//               <span className="text-xs opacity-70">
//                 {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </span>
//             </div>
//             {msg.sender === 'AI' ? (
//               <MessageRenderer text={msg.text} />
//             ) : (
//               <div className="whitespace-pre-wrap break-words">{msg.text}</div>
//             )}
//           </div>
//         ))}

//         {isLoading && (
//           <div className="p-3 rounded-xl max-w-full md:max-w-[80%] bg-gray-800 text-gray-200 self-start">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="text-xs font-medium text-gray-400">AI</span>
//               <span className="text-xs opacity-70">
//                 {new Date().toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </span>
//             </div>
//             <TypingDots />
//           </div>
//         )}

//         <div ref={messagesEndRef} className="h-4" />
//       </div>

//       {/* Input Area - Fixed at bottom */}
//       <div className="flex-shrink-0">
//         <MessageInput
//           input={input}
//           setInput={setInput}
//           isLoading={isLoading}
//           onSend={handleSend}
//           onKeyPress={handleKeyPress}
//         />
//       </div>
//     </div>
//   );
// };

// export default AiPage;

import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { sendMessageToAI } from '../services/AiService';
import TypingDots from '../componenets/TypingDots';
import MessageRenderer from '../componenets/MessageRenderer';
import MessageInput from '../componenets/MessageInput';
import WeatherWidget from '../componenets/WeatherWidget';

const AiPage = ({ setIsSidebarOpen }) => {
  const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
    useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Load messages whenever a chat is selected
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  };

  const handleWeatherData = (weatherData) => {
    setCurrentWeather(weatherData);
  };

  const toggleWeatherWidget = () => {
    setShowWeather(!showWeather);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      await sendMessage(activeChat._id, userInput, 'User');
      const previousMessages = messages;
      const aiReplyText = await sendMessageToAI(
        userInput,
        activeChat._id,
        previousMessages,
      );
      await sendMessage(activeChat._id, aiReplyText, 'AI');
    } catch (error) {
      console.error('Error in message flow:', error);
      addMessage(activeChat._id, {
        _id: Date.now() + 1,
        sender: 'AI',
        text: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 safe-area-inset-top mobile-viewport">
        <div className="text-center">
          <p className="text-xl mb-4">👋 Welcome to AI Chat!</p>
          <p>Select or create a chat to start conversation.</p>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 md:hidden"
          >
            Open Chats
          </button>
        </div>
      </div>
    );
  }

  const messages = chatMessages[activeChat._id] || [];

  return (
    <div className="flex flex-col h-full bg-gray-900 mobile-viewport">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900 safe-area-inset-top flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Open sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate max-w-[200px]">
              {activeChat.name || 'New Chat'}
            </h2>
            <p className="text-sm text-gray-400">{messages.length} messages</p>
          </div>

          <button
            onClick={toggleWeatherWidget}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            title="Toggle Weather"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Weather Widget */}
      {showWeather && (
        <div className="px-4 pt-4 flex-shrink-0">
          <WeatherWidget onWeatherData={handleWeatherData} />
        </div>
      )}

      {/* Messages Area - This should scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto mobile-scroll p-4 md:p-6 flex flex-col gap-3"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <div className="mb-4 text-6xl animate-pulse">🤖</div>
            <p className="text-lg font-medium mb-2">Start a conversation</p>
            <p className="text-sm">I am your AI Assistant. Ask me anything!</p>
            <p className="text-sm mt-2 text-blue-400">
              Try asking about weather! 🌤️
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-xl max-w-full md:max-w-[80%] break-words break-all ${
              msg.sender === 'User'
                ? 'bg-blue-800 text-white self-end'
                : 'bg-gray-800 text-gray-200 self-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-medium ${
                  msg.sender === 'User' ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {msg.sender}
              </span>
              <span className="text-xs opacity-70">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {msg.sender === 'AI' ? (
              <MessageRenderer text={msg.text} />
            ) : (
              <div className="whitespace-pre-wrap break-words">{msg.text}</div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="p-3 rounded-xl max-w-full md:max-w-[80%] bg-gray-800 text-gray-200 self-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-400">AI</span>
              <span className="text-xs opacity-70">
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <TypingDots />
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0">
        <MessageInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default AiPage;
