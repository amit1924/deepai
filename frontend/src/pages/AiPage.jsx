// import React, { useState, useEffect, useRef } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import { sendMessageToAI } from '../services/AiService';
// import TypingDots from '../componenets/TypingDots';
// import MessageRenderer from '../componenets/MessageRenderer';

// const AiPage = ({ setIsSidebarOpen }) => {
//   const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
//     useChatStore();

//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Load messages whenever a chat is selected
//   useEffect(() => {
//     if (activeChat) {
//       fetchMessages(activeChat._id);
//     }
//   }, [activeChat, fetchMessages]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatMessages, isLoading]);

//   if (!activeChat) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
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

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userInput = input;
//     setInput('');
//     setIsLoading(true);

//     try {
//       // Send user message
//       await sendMessage(activeChat._id, userInput, 'User');

//       // Get previous messages for context (excluding the one we just sent)
//       const previousMessages = messages;

//       // Call AI API with context
//       const aiReplyText = await sendMessageToAI(
//         userInput,
//         activeChat._id,
//         previousMessages,
//       );

//       // Send AI message
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
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-900 rounded-lg md:rounded-none md:shadow-none shadow-lg">
//       {/* Header with Hamburger Button */}
//       <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
//         <div className="flex items-center gap-4">
//           {/* Hamburger Button for Mobile */}
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
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3">
//         {messages.length === 0 && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
//             <div className="mb-4 text-6xl animate-pulse">🤖</div>
//             <p className="text-lg font-medium mb-2">Start a conversation</p>
//             <p className="text-sm">I am your AI Assistant. Ask me anything!</p>
//           </div>
//         )}

//         {messages.map((msg, index) => (
//           <div
//             key={msg._id}
//             className={`p-3 rounded-xl max-w-full md:max-w-[80%] ${
//               msg.sender === 'User'
//                 ? 'bg-blue-800 text-white self-end'
//                 : 'bg-gray-900 text-gray-200 self-start'
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
//               {index >= messages.length - 10 && (
//                 <span className="text-xs text-green-400"></span>
//               )}
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
//               <span className="text-xs font-medium text-gray-400"></span>
//               <span className="text-xs opacity-70"></span>
//             </div>
//             <TypingDots />
//           </div>
//         )}

//         <div ref={messagesEndRef} className="h-4" />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg">
//         <div className="flex gap-2 md:gap-3">
//           <div className="flex-1 relative">
//             <textarea
//               placeholder="Type your message... "
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               rows={1}
//               className="w-full p-3 pr-10 rounded-xl bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[44px] max-h-32"
//               style={{
//                 minHeight: '44px',
//                 height: 'auto',
//                 overflowY: 'auto',
//               }}
//               onInput={(e) => {
//                 e.target.style.height = 'auto';
//                 e.target.style.height =
//                   Math.min(e.target.scrollHeight, 128) + 'px';
//               }}
//             />
//             {/* Character count */}
//             {input.length > 0 && (
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
//                 {input.length}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={handleSend}
//             disabled={isLoading || !input.trim()}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 md:px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] flex items-center justify-center"
//           >
//             {isLoading ? (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//             ) : (
//               'Send'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AiPage;

// import React, { useState, useEffect, useRef } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import { sendMessageToAI } from '../services/AiService';
// import TypingDots from '../componenets/TypingDots';
// import MessageRenderer from '../componenets/MessageRenderer';
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from 'react-speech-recognition';

// const AiPage = ({ setIsSidebarOpen }) => {
//   const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
//     useChatStore();

//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Speech recognition
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   // Load messages whenever a chat is selected
//   useEffect(() => {
//     if (activeChat) {
//       fetchMessages(activeChat._id);
//     }
//   }, [activeChat, fetchMessages]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatMessages, isLoading]);

//   // Update input with speech transcript
//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript);
//     }
//   }, [transcript]);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height =
//         Math.min(textareaRef.current.scrollHeight, 128) + 'px';
//     }
//   }, [input]);

//   if (!activeChat) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
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

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userInput = input;
//     setInput('');
//     setIsLoading(true);
//     resetTranscript();

//     try {
//       // Send user message
//       await sendMessage(activeChat._id, userInput, 'User');

//       // Get previous messages for context (excluding the one we just sent)
//       const previousMessages = messages;

//       // Call AI API with context
//       const aiReplyText = await sendMessageToAI(
//         userInput,
//         activeChat._id,
//         previousMessages,
//       );

//       // Send AI message
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
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
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
//     <div className="flex flex-col h-full bg-gray-900 rounded-lg md:rounded-none md:shadow-none shadow-lg">
//       {/* Header with Hamburger Button */}
//       <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
//         <div className="flex items-center gap-4">
//           {/* Hamburger Button for Mobile */}
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
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3">
//         {messages.length === 0 && !isLoading && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
//             <div className="mb-4 text-6xl animate-pulse">🤖</div>
//             <p className="text-lg font-medium mb-2">Start a conversation</p>
//             <p className="text-sm">I am your AI Assistant. Ask me anything!</p>
//           </div>
//         )}

//         {messages.map((msg, index) => (
//           <div
//             key={msg._id}
//             className={`p-3 rounded-xl max-w-full md:max-w-[80%] ${
//               msg.sender === 'User'
//                 ? 'bg-blue-800 text-white self-end'
//                 : 'bg-gray-900 text-gray-200 self-start'
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
//               {index >= messages.length - 10 && (
//                 <span className="text-xs text-green-400"></span>
//               )}
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
//               <span className="text-xs font-medium text-gray-400"></span>
//               <span className="text-xs opacity-70"></span>
//             </div>
//             <TypingDots />
//           </div>
//         )}

//         <div ref={messagesEndRef} className="h-4" />
//       </div>

//       {/* Input Area - Updated with ChatGPT-like design */}
//       <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg">
//         <div className="relative">
//           <div className="flex items-end bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
//             <textarea
//               ref={textareaRef}
//               placeholder="Type your message... "
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               rows={1}
//               className="w-full p-3 pr-20 bg-transparent placeholder-gray-400 text-white resize-none focus:outline-none min-h-[44px] max-h-32"
//               style={{
//                 height: 'auto',
//                 overflowY: 'auto',
//               }}
//             />

//             {/* Buttons Container */}
//             <div className="flex items-center gap-1 p-2">
//               {/* Voice Button */}
//               <button
//                 onClick={handleMicClick}
//                 disabled={!browserSupportsSpeechRecognition}
//                 className={`p-2 rounded-lg transition-colors ${
//                   listening
//                     ? 'bg-red-500 text-white animate-pulse'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                 } ${
//                   !browserSupportsSpeechRecognition
//                     ? 'opacity-50 cursor-not-allowed'
//                     : ''
//                 }`}
//                 title={listening ? 'Stop recording' : 'Start voice input'}
//               >
//                 {listening ? (
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M6 6h12v12H6z" />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
//                     <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
//                   </svg>
//                 )}
//               </button>

//               {/* Send Button */}
//               <button
//                 onClick={handleSend}
//                 disabled={isLoading || !input.trim()}
//                 className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors"
//                 title="Send message"
//               >
//                 {isLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Character count and speech status */}
//           <div className="flex justify-between items-center mt-2 px-1">
//             <div className="text-xs text-gray-400">
//               {listening && (
//                 <span className="flex items-center gap-1 text-red-400">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
//                   </span>
//                   Listening... Speak now
//                 </span>
//               )}
//             </div>

//             {input.length > 0 && (
//               <div className="text-xs text-gray-400">
//                 {input.length} characters
//               </div>
//             )}
//           </div>
//         </div>
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
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import WeatherWidget from '../componenets/WeatherWidget';

const AiPage = ({ setIsSidebarOpen }) => {
  const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
    useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Load messages whenever a chat is selected
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

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
    resetTranscript();

    try {
      // Send user message
      await sendMessage(activeChat._id, userInput, 'User');

      // Get previous messages for context
      const previousMessages = messages;

      // Call AI API with context
      const aiReplyText = await sendMessageToAI(
        userInput,
        activeChat._id,
        previousMessages,
      );

      // Send AI message
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
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSpeechRecognition = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
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

  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
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
    <div className="flex flex-col h-full bg-gray-900 rounded-lg md:rounded-none md:shadow-none shadow-lg">
      {/* Header with Hamburger Button */}
      <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-4">
          {/* Hamburger Button for Mobile */}
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
            <h2 className="text-xl font-bold text-white truncate">
              {activeChat.name || 'New Chat'}
            </h2>
            <p className="text-sm text-gray-400">{messages.length} messages</p>
          </div>

          {/* Weather Toggle Button */}
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
        <div className="px-4 pt-4">
          <WeatherWidget onWeatherData={handleWeatherData} />
        </div>
      )}

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 ${
          showWeather ? 'pt-0' : ''
        }`}
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

        {messages.map((msg, index) => (
          <div
            key={msg._id}
            className={`p-3 rounded-xl max-w-full md:max-w-[80%] ${
              msg.sender === 'User'
                ? 'bg-blue-800 text-white self-end'
                : 'bg-gray-900 text-gray-200 self-start'
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-lg">
        <div className="relative">
          <div className="flex items-end bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <textarea
              ref={textareaRef}
              placeholder="Type your message... (Try: 'weather in London' or 'current weather')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
              className="w-full p-3 pr-20 bg-transparent placeholder-gray-400 text-white resize-none focus:outline-none min-h-[44px] max-h-32"
              style={{
                height: 'auto',
                overflowY: 'auto',
              }}
            />

            {/* Buttons Container */}
            <div className="flex items-center gap-1 p-2">
              {/* Voice Button */}
              <button
                onClick={handleMicClick}
                disabled={!browserSupportsSpeechRecognition}
                className={`p-2 rounded-lg transition-colors ${
                  listening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                } ${
                  !browserSupportsSpeechRecognition
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
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

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors"
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
    </div>
  );
};

export default AiPage;
