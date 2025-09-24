// import React, { useEffect, useRef } from 'react';
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from 'react-speech-recognition';

// const MessageInput = ({ input, setInput, isLoading, onSend, onKeyPress }) => {
//   const textareaRef = useRef(null);

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
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height =
//         Math.min(textareaRef.current.scrollHeight, 128) + 'px';
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

//   return (
//     <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg">
//       <div className="relative">
//         <div className="flex items-end bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
//           <textarea
//             ref={textareaRef}
//             placeholder="Type your message... "
//             value={input}
//             onChange={handleInputChange}
//             onKeyDown={handleInputKeyDown}
//             rows={1}
//             className="w-full p-3 pr-20 bg-transparent placeholder-gray-400 text-white resize-none focus:outline-none min-h-[44px] max-h-32"
//             style={{
//               height: 'auto',
//               overflowY: 'auto',
//             }}
//           />

//           {/* Buttons Container */}
//           <div className="flex items-center gap-1 p-2">
//             {/* Voice Button */}
//             <button
//               onClick={handleMicClick}
//               disabled={!browserSupportsSpeechRecognition}
//               className={`p-2 rounded-lg transition-colors ${
//                 listening
//                   ? 'bg-red-500 text-white animate-pulse'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700'
//               } ${
//                 !browserSupportsSpeechRecognition
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
//               disabled={isLoading || !input.trim()}
//               className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors"
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
//         <div className="flex justify-between items-center mt-2 px-1">
//           <div className="text-xs text-gray-400">
//             {listening && (
//               <span className="flex items-center gap-1 text-red-400">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
//                 </span>
//                 Listening... Speak now
//               </span>
//             )}
//           </div>

//           {input.length > 0 && (
//             <div className="text-xs text-gray-400">
//               {input.length} characters
//             </div>
//           )}
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

const MessageInput = ({ input, setInput, isLoading, onSend, onKeyPress }) => {
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  // Reset textarea height when input is cleared (after send)
  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '44px';
    }
  }, [input]);

  // Auto-resize textarea when typing
  useEffect(() => {
    const resizeTextarea = () => {
      if (textareaRef.current && input !== '') {
        const previousScrollTop = textareaRef.current.scrollTop;

        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 128) + 'px';

        textareaRef.current.scrollTop = previousScrollTop;
      }
    };

    const animationId = requestAnimationFrame(resizeTextarea);
    return () => cancelAnimationFrame(animationId);
  }, [input]);

  // Prevent zoom on focus for iOS
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const preventZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    textarea.addEventListener('touchstart', preventZoom);
    return () => {
      textarea.removeEventListener('touchstart', preventZoom);
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    } else {
      onKeyPress(e);
    }
  };

  const handleSendClick = () => {
    if (input.trim()) {
      onSend();
      resetTranscript();
      // Input will be cleared by parent component, which triggers height reset
    }
  };

  // Improved speech recognition for mobile
  const toggleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      if (isMobile) {
        SpeechRecognition.startListening({
          continuous: false,
          language: 'en-US',
          interimResults: true,
        });
      } else {
        SpeechRecognition.startListening({ continuous: true });
      }
    }
  };

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
      );
      return;
    }

    // Vibration feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    toggleSpeechRecognition();
  };

  return (
    <div
      ref={containerRef}
      className="p-4 border-t border-gray-700 bg-gray-900 sticky bottom-0"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
      }}
    >
      <div className="relative">
        {/* Main Input Container */}
        <div className="flex items-start gap-2">
          {/* Textarea Container - Takes most space */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              {/* <textarea
                ref={textareaRef}
                placeholder="Type your message... "
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                rows={1}
                className="w-full p-3 bg-transparent placeholder-gray-400 text-white resize-none focus:outline-none min-h-[44px] max-h-32"
                style={{
                  height: '44px',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'manipulation',
                }}
                inputMode="text"
                enterKeyHint="send"
              /> */}
              <textarea
                ref={textareaRef}
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                rows={1}
                className="
    w-full max-w-[700px]
    p-2 sm:p-3
    bg-transparent placeholder-gray-400 text-white
    resize-none focus:outline-none
    min-h-[26px] sm:min-h-[34px]
    max-h-16 sm:max-h-24
  "
                style={{
                  height: '26px',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'manipulation',
                }}
                inputMode="text"
                enterKeyHint="send"
              />
            </div>
          </div>

          {/* Buttons Container - Outside textarea, fixed size */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Voice Button */}
            <button
              onClick={handleMicClick}
              disabled={!browserSupportsSpeechRecognition}
              className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              } ${
                !browserSupportsSpeechRecognition
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              title={listening ? 'Stop recording' : 'Start voice input'}
              style={{
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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

            {/* Send Button */}
            <button
              onClick={handleSendClick}
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors flex-shrink-0"
              title="Send message"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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

        {/* Character count and speech status */}
        <div className="flex justify-between items-center mt-2 px-1">
          <div className="text-xs text-gray-400">
            {listening && (
              <span className="flex items-center gap-1 text-red-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Listening... Speak now
              </span>
            )}
          </div>

          {input.length > 0 && (
            <div className="text-xs text-gray-400">
              {input.length} characters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
