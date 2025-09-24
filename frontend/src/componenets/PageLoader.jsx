import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      {/* Option 1: Modern Dot Pulse Animation */}
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-6">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-45 animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-lg transform rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg transform -rotate-45">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
        </div>

        {/* Text with gradient animation */}
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold text-lg">
          Loading your AI experience
          <span className="inline-block ml-1 animate-pulse">...</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-48 mx-auto bg-gray-700 rounded-full h-1.5">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full animate-progress"></div>
        </div>
      </div>

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Alternative minimalist version
export const MinimalPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Spinning ring */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
};

// Alternative wave loader
export const WavePageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex justify-center space-x-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            ></div>
          ))}
        </div>
        <p className="text-cyan-100 font-medium text-lg">
          Preparing your chat...
        </p>
      </div>
    </div>
  );
};

// Advanced loader with percentage
export const AdvancedPageLoader = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Circular progress */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (progress * 251.2) / 100}
              className="text-blue-500 animate-draw"
              style={{
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{progress}%</span>
          </div>
        </div>

        <p className="text-gray-300 font-medium mb-2">Initializing AI</p>
        <div className="text-xs text-gray-500">
          {progress < 30 && 'Loading core modules...'}
          {progress >= 30 && progress < 70 && 'Connecting to services...'}
          {progress >= 70 && progress < 100 && 'Almost ready...'}
          {progress >= 100 && 'Complete!'}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
