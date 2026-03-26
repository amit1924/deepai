import React, { useRef, useState, useEffect } from 'react';
import { Send, Image, Mic, X, Paperclip, Smile } from 'lucide-react';

const MessageInput = ({
  input,
  setInput,
  isLoading,
  onSend,
  onKeyPress,
  hasImage,
  onImageSelect,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Common suggested questions
  const suggestions = [
    "What can you tell me about this image?",
    "Describe what you see in detail",
    "What colors are in this image?",
    "Can you analyze the composition?",
    "What's the mood of this image?"
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Handle image selection
  const handleImageSelect = (file) => {
    if (file && onImageSelect) {
      onImageSelect(file);
    }
    setShowSuggestions(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
    e.target.value = '';
  };

  // Simulate voice recording (beautiful animation)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording for demo
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
          setInput(prev => prev + (prev ? ' ' : '') + "I'd like to know more about this");
        }
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Handle send with animation
  const handleSendClick = () => {
    if (!isLoading && (input.trim() || hasImage)) {
      onSend();
      // Shrink textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setShowSuggestions(false);
    }
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (input.trim() || hasImage)) {
        handleSendClick();
      }
    }
  };

  // Clear input
  const clearInput = () => {
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Use suggestion
  const useSuggestion = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Suggestions Popup */}
      {showSuggestions && hasImage && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden animate-slideUp">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2">Suggested questions about this image:</div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => useSuggestion(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-150"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div
        ref={containerRef}
        className={`
          relative bg-gray-800/80 backdrop-blur-sm rounded-2xl transition-all duration-300
          border ${isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700'}
          ${hasImage ? 'ring-2 ring-blue-500/30' : ''}
        `}
      >
        {/* Image Preview Bar */}
        {hasImage && (
          <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-gray-700">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Image size={16} className="text-blue-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <span className="text-sm text-gray-300 flex-1">
              Image ready for analysis
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Change
            </button>
          </div>
        )}

        {/* Recording Bar */}
        {isRecording && (
          <div className="flex items-center gap-3 px-4 pt-3 pb-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0" />
              </div>
              <span className="text-sm text-red-400 font-medium">Recording</span>
            </div>
            <div className="flex-1">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
            <button
              onClick={toggleRecording}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2 p-3">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* Image Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`
                group relative p-2 rounded-xl transition-all duration-200
                ${isLoading 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700/50'
                }
              `}
              title="Upload image"
            >
              <Paperclip size={20} className="transform group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Upload image
              </span>
            </button>

            {/* Voice Input */}
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`
                group relative p-2 rounded-xl transition-all duration-200
                ${isLoading 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : isRecording
                    ? 'text-red-400 bg-red-400/10 animate-pulse'
                    : 'text-gray-400 hover:text-purple-400 hover:bg-gray-700/50'
                }
              `}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <Mic size={20} />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isRecording ? "Stop recording" : "Voice input"}
              </span>
            </button>

            {/* Suggestions Button (only when image is present) */}
            {hasImage && (
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="group relative p-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-green-400 hover:bg-gray-700/50"
                title="Get suggestions"
              >
                <Smile size={20} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Suggestions
                </span>
              </button>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                hasImage
                  ? "Ask me anything about this image..."
                  : isRecording
                  ? "Listening... speak now"
                  : "Type your message..."
              }
              disabled={isLoading || isRecording}
              rows={1}
              className={`
                w-full bg-transparent text-white placeholder-gray-500
                border-none outline-none resize-none
                text-base leading-6
                ${(isLoading || isRecording) ? 'cursor-not-allowed opacity-50' : ''}
              `}
              style={{ 
                minHeight: '44px',
                maxHeight: '120px'
              }}
            />
            
            {/* Clear Button */}
            {input && !isLoading && !isRecording && (
              <button
                onClick={clearInput}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendClick}
            disabled={isLoading || isRecording || (!input.trim() && !hasImage)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
              transform active:scale-95
              ${isLoading || isRecording || (!input.trim() && !hasImage)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-2 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {input.length > 0 && (
              <span>{input.length} characters</span>
            )}
            {hasImage && !input && (
              <span className="text-blue-400">✨ Image ready</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">Shift</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">Enter</kbd>
            <span>for new line</span>
            <span className="w-px h-3 bg-gray-700" />
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">Enter</kbd>
            <span>to send</span>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

// Add animation to your global CSS or tailwind config
const styles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideUp {
    animation: slideUp 0.2s ease-out;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.querySelector('#message-input-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'message-input-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MessageInput;