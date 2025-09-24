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
      <div className="flex items-center justify-center h-full bg-graay-900 p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">👋</div>
          <p className="text-white text-xl font-semibold mb-2">
            Welcome to AI Chat!
          </p>
          <p className="text-gray-300 mb-6">
            Select or create a chat to start conversation.
          </p>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Open Chats
          </button>
        </div>
      </div>
    );
  }

  const messages = chatMessages[activeChat._id] || [];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
              aria-label="Open sidebar"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              {/* <h2 className="text-white font-semibold text-lg">
                {activeChat.name || 'New Chat'}
              </h2> */}
              <h2 className="text-white font-semibold text-lg truncate max-w-[140px] sm:max-w-[200px]">
                {activeChat.name || 'New Chat'}
              </h2>

              <p className="text-gray-400 text-sm">
                {messages.length} messages
              </p>
            </div>
          </div>

          <button
            onClick={toggleWeatherWidget}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
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
        // <div className="bg-gray-800 border-b border-gray-700 p-4">
        //   <WeatherWidget onWeatherData={handleWeatherData} />
        // </div>
        <div className="bg-gray-800 border-b border-gray-700 p-2 sm:p-4">
          <WeatherWidget className="w-full" />
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {messages.length === 0 && !isLoading && (
          <div className="text-center max-w-2xl mx-auto mt-20">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-white text-xl font-semibold mb-2">
              Start a conversation
            </p>
            <p className="text-gray-300 mb-4">
              I am your AI Assistant. Ask me anything!
            </p>
            <p className="text-gray-400 text-sm">
              Try asking about weather! 🌤️
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] break-words ${
              msg.sender === 'User'
                ? 'bg-blue-800 text-white ml-auto'
                : 'bg-gray-900 text-gray-200 mr-auto'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
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
              <div className="whitespace-pre-wrap">{msg.text}</div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] bg-gray-700 text-gray-200 mr-auto">
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

      {/* Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 p-4  md:mb-1">
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
