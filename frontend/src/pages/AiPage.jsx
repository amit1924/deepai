import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { sendMessageToAI } from '../services/AiService';
import TypingDots from '../componenets/TypingDots';
import MessageRenderer from '../componenets/MessageRenderer';
import MessageInput from '../componenets/MessageInput';
import WeatherWidget from '../componenets/WeatherWidget';
import RandomImageGenerator from '../componenets/RandomImageGenerator';

const AiPage = ({ setIsSidebarOpen }) => {
  const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
    useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat, fetchMessages]);

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

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      setSelectedImage(base64Image);
      setImagePreview(base64Image);
      setInput('');
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Error processing image. Please try another file.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleWeatherData = (weatherData) => {
    setCurrentWeather(weatherData);
  };

  const toggleWeatherWidget = () => {
    setShowWeather(!showWeather);
    if (showImageGenerator) setShowImageGenerator(false);
  };

  const toggleImageGenerator = () => {
    setShowImageGenerator(!showImageGenerator);
    if (showWeather) setShowWeather(false);
  };

  const handleImageGenerated = (imageData, prompt) => {
    if (!activeChat) return;

    addMessage(activeChat._id, {
      _id: Date.now().toString(),
      sender: 'AI',
      type: 'image',
      prompt: prompt,
      url: imageData,
      text: `I've generated an image for: "${prompt}"`,
      createdAt: new Date().toISOString(),
    });

    setShowImageGenerator(false);
    scrollToBottom();
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userInput = input || 'What can you tell me about this image?';
    setInput('');
    setIsLoading(true);

    try {
      await sendMessage(activeChat._id, userInput, 'User');

      const previousMessages = messages;
      const aiReplyText = await sendMessageToAI(
        userInput,
        activeChat._id,
        previousMessages,
        selectedImage,
      );

      await sendMessage(activeChat._id, aiReplyText, 'AI');
      removeImage();
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
      <div className="flex items-center justify-center h-full p-4">
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
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header - Clean and minimal */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
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
              <h2 className="text-white font-semibold text-lg truncate max-w-[140px] sm:max-w-[200px] md:max-w-[300px]">
                {activeChat.name || 'New Chat'}
              </h2>
              <p className="text-gray-400 text-sm">
                {messages.length} messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Image Analysis Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              title="Upload Image for Analysis"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Image Generation Button */}
            <button
              onClick={toggleImageGenerator}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              title="Generate AI Image"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>

            {/* Weather Button */}
            <button
              onClick={toggleWeatherWidget}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
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
      </div>

      {/* Hidden file input for image analysis */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleImageSelect(file);
          e.target.value = '';
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Image Preview for Analysis */}
      {imagePreview && (
        <div className="px-4 py-3 bg-gray-800/50">
          <div className="flex items-center justify-between max-w-full mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <span className="text-gray-300 text-sm">
                Image ready for analysis! Ask me anything about it.
              </span>
            </div>
            <button
              onClick={() => setInput('What can you tell me about this image?')}
              className="text-blue-400 text-sm hover:text-blue-300 whitespace-nowrap"
            >
              Suggest question
            </button>
          </div>
        </div>
      )}

      {/* Weather Widget */}
      {showWeather && (
        <div className="px-4 py-3 bg-gray-800/50">
          <WeatherWidget className="w-full" />
        </div>
      )}

      {/* Image Generator Widget */}
      {showImageGenerator && (
        <div className="px-4 py-3 bg-gray-800/50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">AI Image Generator</h3>
            <button
              onClick={toggleImageGenerator}
              className="text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          </div>
          <RandomImageGenerator
            onImageGenerated={handleImageGenerated}
            compact={true}
          />
        </div>
      )}

      {/* Messages Area - Full width */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
      >
        {messages.length === 0 && !isLoading && (
          <div className="text-center max-w-2xl mx-auto mt-20">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-white text-xl font-semibold mb-2">
              Ask me anything!
            </p>
            <p className="text-gray-300 mb-4">
              I can analyze images or generate new ones! Try both features.
            </p>
            <p className="text-gray-400 text-sm">
              Upload an image for analysis or generate a new one! 🎨
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`w-full max-w-full p-4 rounded-lg ${
              msg.sender === 'User'
                ? 'ml-auto text-slate-100 bg-purple-950 text-lg'
                : 'mr-auto text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-medium ${
                  msg.sender === 'User' ? 'text-blue-300' : 'text-green-300'
                }`}
              >
                {msg.sender}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Render AI images or text */}
            {msg.sender === 'AI' ? (
              msg.type === 'image' ? (
                <div className="p-3 rounded-xl">
                  <p className="text-gray-300 mb-2">
                    🖼️ Generated image for: <b>{msg.prompt}</b>
                  </p>
                  <img
                    src={msg.url}
                    alt={msg.prompt}
                    className="rounded-lg max-w-full max-h-96 object-contain"
                  />
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <a
                      href={msg.url}
                      download={`ai-generated-${msg.prompt.substring(
                        0,
                        20,
                      )}.png`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Download Image
                    </a>
                    <button
                      onClick={() =>
                        setInput(
                          `Tell me more about this generated image: ${msg.prompt}`,
                        )
                      }
                      className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Ask about this
                    </button>
                  </div>
                </div>
              ) : (
                <MessageRenderer text={msg.text} />
              )
            ) : (
              <div className="whitespace-pre-wrap text-gray-100">
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="w-full max-w-full p-4 rounded-lg text-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-green-300">AI</span>
              <span className="text-xs text-gray-500">
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
      <div className="px-4 py-3">
        <MessageInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          hasImage={!!selectedImage}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
};

export default AiPage;
