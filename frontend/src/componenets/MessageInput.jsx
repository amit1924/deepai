// import React, { useEffect, useRef } from 'react';
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from 'react-speech-recognition';

// const MessageInput = ({
//   input,
//   setInput,
//   isLoading,
//   onSend,
//   onKeyPress,
//   hasImage,
//   onImageSelect, // Add this prop
// }) => {
//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   // Update input with speech transcript
//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript);
//     }
//   }, [transcript, setInput]);

//   // Auto-resize textarea
//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = 'auto';
//       textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
//     }
//   }, [input]);

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleInputKeyDown = (e) => {
//     onKeyPress(e);
//   };

//   const handleSendClick = () => {
//     onSend();
//     resetTranscript();
//   };

//   const toggleSpeechRecognition = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//     } else {
//       resetTranscript();
//       SpeechRecognition.startListening({ continuous: true });
//     }
//   };

//   const handleMicClick = () => {
//     if (!browserSupportsSpeechRecognition) {
//       alert(
//         'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
//       );
//       return;
//     }
//     toggleSpeechRecognition();
//   };

//   // Handle image upload button click
//   const handleImageButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && onImageSelect) {
//       onImageSelect(file);
//     }
//     // Reset the input to allow selecting the same file again
//     event.target.value = '';
//   };

//   return (
//     <div className="w-full px-1 sm:px-3 mb-8 md:mb-0">
//       {/* Hidden file input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept="image/*"
//         className="hidden"
//       />

//       <div className="relative bg-gray-900 rounded-2xl border border-gray-600 focus-within:border-blue-500 transition-colors duration-200 bottom-3 top-8 md:top-2">
//         <div className="flex items-center px-3 md:p-2">
//           <textarea
//             ref={textareaRef}
//             className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[40px] max-h-[120px] py-3 px-2 text-xl leading-tight scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
//             placeholder={
//               hasImage ? 'Ask about the image...' : 'Type your message...'
//             }
//             value={input}
//             onChange={handleInputChange}
//             onKeyDown={handleInputKeyDown}
//             rows={1}
//           />

//           {/* Buttons Container */}
//           <div className="flex items-center gap-2 ml-2">
//             {/* Image Upload Button */}
//             <button
//               type="button"
//               onClick={handleImageButtonClick}
//               disabled={isLoading}
//               className={`p-2 rounded-full transition-colors duration-200 flex items-center justify-center ${
//                 hasImage
//                   ? 'bg-green-600 text-white'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-600'
//               } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               title={hasImage ? 'Image attached' : 'Upload image'}
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </button>

//             {/* Voice Button */}
//             <button
//               onClick={handleMicClick}
//               disabled={!browserSupportsSpeechRecognition || isLoading}
//               className={`p-2 rounded-full transition-colors duration-200 flex items-center justify-center ${
//                 listening
//                   ? 'bg-red-500 text-white animate-pulse'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-600'
//               } ${
//                 !browserSupportsSpeechRecognition || isLoading
//                   ? 'opacity-50 cursor-not-allowed'
//                   : ''
//               }`}
//               title={listening ? 'Stop recording' : 'Start voice input'}
//             >
//               {listening ? (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M6 6h12v12H6z" />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                   <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
//                 </svg>
//               )}
//             </button>

//             {/* Send Button */}
//             <button
//               onClick={handleSendClick}
//               disabled={isLoading || (!input.trim() && !hasImage)}
//               className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
//               title="Send message"
//             >
//               {isLoading ? (
//                 <svg
//                   className="animate-spin h-5 w-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Character count and speech status */}
//         <div className="flex justify-between items-center px-3 py-1">
//           <div className="flex items-center gap-2">
//             {listening && (
//               <span className="flex items-center gap-2 text-red-400 text-xs">
//                 <span className="flex space-x-1">
//                   <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
//                   <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-75"></span>
//                 </span>
//                 Listening... Speak now
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             {hasImage && (
//               <span className="flex items-center gap-1 text-green-400 text-xs">
//                 <svg
//                   className="w-3 h-3"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 Image attached
//               </span>
//             )}
//             {input.length > 0 && (
//               <div className="text-gray-400 text-xs">
//                 {input.length} characters
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageInput;

import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const MessageInput = ({
  input,
  setInput,
  isLoading,
  onSend,
  onKeyPress,
  hasImage,
  onImageSelect,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  // Auto-resize textarea - FIXED HEIGHT
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Limit height for better responsiveness
      const newHeight = Math.min(textarea.scrollHeight, 80);
      textarea.style.height = newHeight + 'px';
    }
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    onKeyPress(e);
  };

  const handleSendClick = () => {
    onSend();
    resetTranscript();
  };

  const toggleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
      );
      return;
    }
    toggleSpeechRecognition();
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
    event.target.value = '';
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6 pb-8 md:pb-6 pt-2">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        className={`
        relative bg-white dark:bg-gray-800 
        rounded-2xl border transition-all duration-200
        shadow-lg
        ${
          isFocused || listening
            ? 'border-blue-500 shadow-blue-500/10 ring-2 ring-blue-500/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${hasImage ? 'border-green-500 shadow-green-500/10' : ''}
      `}
      >
        <div className="flex items-end gap-2 p-3">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={handleImageButtonClick}
              disabled={isLoading}
              className={`
                relative p-2 rounded-xl transition-all duration-200
                flex items-center justify-center
                ${
                  hasImage
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                }
              `}
              title={hasImage ? 'Image attached' : 'Upload image'}
            >
              <svg
                className="w-5 h-5"
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

            {/* Voice Button */}
            <button
              onClick={handleMicClick}
              disabled={!browserSupportsSpeechRecognition || isLoading}
              className={`
                relative p-2 rounded-xl transition-all duration-200
                flex items-center justify-center
                ${
                  listening
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${
                  !browserSupportsSpeechRecognition || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105'
                }
              `}
              title={listening ? 'Stop recording' : 'Start voice input'}
            >
              {listening ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h12v12H6z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Text Input Area - PROPERLY SIZED */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none min-h-[40px] max-h-[80px] py-2 px-3 text-base leading-normal rounded-lg border-0 focus:ring-0 transition-all duration-200 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              placeholder={
                hasImage ? 'Ask about the image...' : 'Type your message...'
              }
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSendClick}
              disabled={isLoading || (!input.trim() && !hasImage)}
              className={`
                p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center
                bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 
                disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
                text-white shadow-sm hover:shadow-md active:scale-95
                ${isLoading ? 'cursor-wait' : ''}
                min-w-[44px] min-h-[44px] /* Mobile touch target */
              `}
              title="Send message"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Status Bar - Only show when needed */}
        {(listening || hasImage || input.length > 0) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-2xl text-xs">
            {/* Left side - Speech status */}
            <div className="flex items-center gap-2">
              {listening && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                  <span>Listening...</span>
                </div>
              )}
            </div>

            {/* Right side - Indicators */}
            <div className="flex items-center gap-3 flex-wrap">
              {hasImage && (
                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image attached
                </span>
              )}

              {input.length > 0 && (
                <div
                  className={`
                  px-2 py-1 rounded-md font-medium
                  ${
                    input.length > 800
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : input.length > 500
                      ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
                  }
                `}
                >
                  {input.length} / 1000
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
