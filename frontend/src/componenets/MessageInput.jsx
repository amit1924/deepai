import React, { useRef, useState, useEffect } from 'react';
import { Send, Image, Mic, X } from 'lucide-react';

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
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [input]);

  // Handle image selection
  const handleImageSelect = (file) => {
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
    e.target.value = '';
  };

  // Voice recording (simplified)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput(prev => prev + (prev ? ' ' : '') + "I'd like to know more");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Handle send
  const handleSendClick = () => {
    if (!isLoading && (input.trim() || hasImage)) {
      onSend();
    }
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <div className="w-full">
      {/* Image Preview Bar */}
      {hasImage && (
        <div className="mb-2 px-3 py-2 bg-gray-800/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">Image ready</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Change
          </button>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mb-2 px-3 py-2 bg-red-500/10 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-400">Recording...</span>
          <button
            onClick={toggleRecording}
            className="text-xs text-gray-400 hover:text-white ml-auto"
          >
            Stop
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative bg-gray-800 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
        <div className="flex items-end gap-2 p-2">
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Image Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Upload image"
            >
              <Image size={18} />
            </button>

            {/* Voice Recording */}
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : isRecording
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <Mic size={18} />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasImage
                  ? "Ask about this image..."
                  : isRecording
                  ? "Recording..."
                  : "Type a message..."
              }
              disabled={isLoading || isRecording}
              rows={1}
              className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none text-sm leading-6"
              style={{ 
                minHeight: '36px',
                maxHeight: '100px'
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendClick}
            disabled={isLoading || isRecording || (!input.trim() && !hasImage)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
              isLoading || isRecording || (!input.trim() && !hasImage)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
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

export default MessageInput;