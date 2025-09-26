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
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef(null);
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

//   // Convert image file to base64
//   const convertImageToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };

//   // Handle image selection from MessageInput component
//   const handleImageSelect = async (file) => {
//     if (!file) return;

//     // Check if file is an image
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }

//     // Check file size (limit to 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Please select an image smaller than 5MB');
//       return;
//     }

//     try {
//       const base64Image = await convertImageToBase64(file);
//       setSelectedImage(base64Image);
//       setImagePreview(base64Image);

//       // Auto-focus the input and set placeholder text
//       setInput(''); // Clear any existing text
//     } catch (error) {
//       console.error('Error converting image:', error);
//       alert('Error processing image. Please try another file.');
//     }
//   };

//   // Remove selected image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//   };

//   const handleWeatherData = (weatherData) => {
//     setCurrentWeather(weatherData);
//   };

//   const toggleWeatherWidget = () => {
//     setShowWeather(!showWeather);
//   };

//   const handleSend = async () => {
//     if (!input.trim() && !selectedImage) return;

//     const userInput = input || 'What can you tell me about this image?';
//     setInput('');
//     setIsLoading(true);

//     try {
//       // Send user message with image if available
//       await sendMessage(activeChat._id, userInput, 'User');

//       const previousMessages = messages;
//       const aiReplyText = await sendMessageToAI(
//         userInput,
//         activeChat._id,
//         previousMessages,
//         selectedImage, // Pass the image data to Gemini
//       );

//       await sendMessage(activeChat._id, aiReplyText, 'AI');

//       // Clear image after sending
//       removeImage();
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
//       <div className="flex items-center justify-center h-full bg-gray-900 p-4">
//         <div className="text-center max-w-md mx-auto">
//           <div className="text-6xl mb-4">👋</div>
//           <p className="text-white text-xl font-semibold mb-2">
//             Welcome to AI Chat!
//           </p>
//           <p className="text-gray-300 mb-6">
//             Select or create a chat to start conversation.
//           </p>
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//           >
//             Open Chats
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const messages = chatMessages[activeChat._id] || [];

//   return (
//     <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="md:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
//               aria-label="Open sidebar"
//             >
//               <svg
//                 className="w-5 h-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>

//             <div>
//               <h2 className="text-white font-semibold text-lg truncate max-w-[140px] sm:max-w-[200px]">
//                 {activeChat.name || 'New Chat'}
//               </h2>
//               <p className="text-gray-400 text-sm">
//                 {messages.length} messages
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Image Upload Button (Alternative) */}
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
//               title="Upload Image"
//             >
//               <svg
//                 className="w-5 h-5 text-white"
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

//             <button
//               onClick={toggleWeatherWidget}
//               className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
//               title="Toggle Weather"
//             >
//               <svg
//                 className="w-5 h-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Hidden file input (alternative upload method) */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={(e) => {
//           const file = e.target.files[0];
//           if (file) handleImageSelect(file);
//           e.target.value = ''; // Reset input
//         }}
//         accept="image/*"
//         className="hidden"
//       />

//       {/* Image Preview */}
//       {imagePreview && (
//         <div className="bg-gray-800 border-b border-gray-700 p-4">
//           <div className="flex items-center justify-between max-w-2xl mx-auto">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-16 h-16 object-cover rounded-lg border border-gray-600"
//                 />
//                 <button
//                   onClick={removeImage}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
//                 >
//                   ×
//                 </button>
//               </div>
//               <span className="text-gray-300 text-sm">
//                 Image ready! Ask me anything about it.
//               </span>
//             </div>
//             <button
//               onClick={() => setInput('What can you tell me about this image?')}
//               className="text-blue-400 text-sm hover:text-blue-300"
//             >
//               Suggest question
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Weather Widget */}
//       {showWeather && (
//         <div className="bg-gray-800 border-b border-gray-700 p-2 sm:p-4">
//           <WeatherWidget className="w-full" />
//         </div>
//       )}

//       {/* Messages Area */}
//       <div
//         ref={messagesContainerRef}
//         className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
//       >
//         {messages.length === 0 && !isLoading && (
//           <div className="text-center max-w-2xl mx-auto mt-20">
//             <div className="text-6xl mb-4">🤖</div>
//             <p className="text-white text-xl font-semibold mb-2">
//               Start a conversation
//             </p>
//             <p className="text-gray-300 mb-4">
//               I can analyze images! Upload a photo and ask questions about it.
//             </p>
//             <p className="text-gray-400 text-sm">
//               Try uploading an image or asking about weather! 🌤️
//             </p>
//           </div>
//         )}

//         {/* {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] break-words ${
//               msg.sender === 'User'
//                 ? 'bg-gray-800 text-slate-100 ml-auto'
//                 : 'text-gray-200 mr-auto font-semibold'
//             }`}
//           >
//             <div className="flex items-center gap-2 mb-2">
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
//               <div className="whitespace-pre-wrap">{msg.text}</div>
//             )}
//           </div>
//         ))} */}
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] break-words ${
//               msg.sender === 'User'
//                 ? 'bg-gray-800 text-slate-100 ml-auto'
//                 : 'text-gray-200 mr-auto font-semibold'
//             }`}
//           >
//             <div className="flex items-center gap-2 mb-2">
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

//             {/* Render AI images or text */}
//             {msg.sender === 'AI' ? (
//               msg.type === 'image' ? (
//                 <div className="bg-gray-900 p-3 rounded-xl">
//                   <p className="text-gray-300 mb-2">
//                     🖼️ Generated image for: <b>{msg.prompt}</b>
//                   </p>
//                   <img
//                     src={msg.url}
//                     alt={msg.prompt}
//                     className="rounded-lg border border-gray-600 max-w-full"
//                   />
//                   <a
//                     href={msg.url}
//                     download="ai-generated.png"
//                     className="mt-2 inline-block text-blue-400 hover:underline text-sm"
//                   >
//                     Download
//                   </a>
//                 </div>
//               ) : (
//                 <MessageRenderer text={msg.text} />
//               )
//             ) : (
//               <div className="whitespace-pre-wrap">{msg.text}</div>
//             )}
//           </div>
//         ))}

//         {isLoading && (
//           <div className="p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] bg-gray-700 text-gray-200 mr-auto">
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

//       {/* Input Area - FIX: Pass onImageSelect prop */}
//       <div className="md:p-4 px-1 py-1 md:mb-1 mb-4">
//         <MessageInput
//           input={input}
//           setInput={setInput}
//           isLoading={isLoading}
//           onSend={handleSend}
//           onKeyPress={handleKeyPress}
//           hasImage={!!selectedImage}
//           onImageSelect={handleImageSelect} // THIS WAS MISSING!
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
import RandomImageGenerator from '../componenets/RandomImageGenerator'; // Import the generator

const AiPage = ({ setIsSidebarOpen }) => {
  const { activeChat, chatMessages, fetchMessages, sendMessage, addMessage } =
    useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false); // New state for image generator
  const [currentWeather, setCurrentWeather] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
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

  // Convert image file to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle image selection from MessageInput component
  const handleImageSelect = async (file) => {
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      setSelectedImage(base64Image);
      setImagePreview(base64Image);
      setInput(''); // Clear any existing text
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Error processing image. Please try another file.');
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleWeatherData = (weatherData) => {
    setCurrentWeather(weatherData);
  };

  const toggleWeatherWidget = () => {
    setShowWeather(!showWeather);
    // Close image generator if open
    if (showImageGenerator) setShowImageGenerator(false);
  };

  const toggleImageGenerator = () => {
    setShowImageGenerator(!showImageGenerator);
    // Close weather widget if open
    if (showWeather) setShowWeather(false);
  };

  // Function to handle generated image from the generator
  const handleImageGenerated = (imageData, prompt) => {
    if (!activeChat) return;

    // Add the generated image to the chat
    addMessage(activeChat._id, {
      _id: Date.now().toString(),
      sender: 'AI',
      type: 'image',
      prompt: prompt,
      url: imageData,
      text: `I've generated an image for: "${prompt}"`,
      createdAt: new Date().toISOString(),
    });

    // Close the generator
    setShowImageGenerator(false);

    // Scroll to bottom to show the new image
    scrollToBottom();
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userInput = input || 'What can you tell me about this image?';
    setInput('');
    setIsLoading(true);

    try {
      // Send user message with image if available
      await sendMessage(activeChat._id, userInput, 'User');

      const previousMessages = messages;
      const aiReplyText = await sendMessageToAI(
        userInput,
        activeChat._id,
        previousMessages,
        selectedImage, // Pass the image data to Gemini for analysis
      );

      await sendMessage(activeChat._id, aiReplyText, 'AI');

      // Clear image after sending
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
      <div className="flex items-center justify-center h-full bg-gray-900 p-4">
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
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 relative">
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
              <h2 className="text-white font-semibold text-lg truncate max-w-[140px] sm:max-w-[200px]">
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
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
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
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
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
      </div>

      {/* Hidden file input for image analysis */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleImageSelect(file);
          e.target.value = ''; // Reset input
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Image Preview for Analysis */}
      {imagePreview && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
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
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              Suggest question
            </button>
          </div>
        </div>
      )}

      {/* Weather Widget */}
      {showWeather && (
        <div className="bg-gray-800 border-b border-gray-700 p-2 sm:p-4">
          <WeatherWidget className="w-full" />
        </div>
      )}

      {/* Image Generator Widget */}
      {showImageGenerator && (
        <div className="bg-gray-800 border-b border-gray-700 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">AI Image Generator</h3>
            <button
              onClick={toggleImageGenerator}
              className="text-gray-400 hover:text-white"
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
            className={`p-4 rounded-2xl max-w-full md:max-w-[80%] lg:max-w-[70%] break-words ${
              msg.sender === 'User'
                ? 'bg-gray-800 text-slate-100 ml-auto'
                : 'text-gray-200 mr-auto font-semibold'
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

            {/* Render AI images or text */}
            {msg.sender === 'AI' ? (
              msg.type === 'image' ? (
                <div className="bg-gray-900 p-3 rounded-xl">
                  <p className="text-gray-300 mb-2">
                    🖼️ Generated image for: <b>{msg.prompt}</b>
                  </p>
                  <img
                    src={msg.url}
                    alt={msg.prompt}
                    className="rounded-lg border border-gray-600 max-w-full max-h-96 object-contain"
                  />
                  <div className="mt-2 flex gap-2">
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
                      className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Ask about this
                    </button>
                  </div>
                </div>
              ) : (
                <MessageRenderer text={msg.text} />
              )
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
      <div className="md:p-4 px-1 py-1 md:mb-1 mb-4">
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
