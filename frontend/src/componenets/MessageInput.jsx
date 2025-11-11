// import React, { useRef, useState, useEffect } from 'react';
// import { Send, Image, Mic, Square, Upload, X } from 'lucide-react';

// const MessageInput = ({
//   input,
//   setInput,
//   isLoading,
//   onSend,
//   onKeyPress,
//   hasImage,
//   onImageSelect,
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);
//   const recordingIntervalRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current);
//       }
//       if (mediaRecorder && mediaRecorder.state === 'recording') {
//         mediaRecorder.stop();
//       }
//     };
//   }, [mediaRecorder]);

//   // Initialize media recorder
//   const initializeMediaRecorder = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 44100,
//         },
//       });

//       const recorder = new MediaRecorder(stream);
//       const chunks = [];

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunks.push(e.data);
//         }
//       };

//       recorder.onstop = async () => {
//         const audioBlob = new Blob(chunks, { type: 'audio/wav' });
//         await convertSpeechToText(audioBlob);

//         // Stop all tracks
//         stream.getTracks().forEach((track) => track.stop());
//         setAudioChunks([]);
//       };

//       setMediaRecorder(recorder);
//       return recorder;
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       alert(
//         'Cannot access microphone. Please check your permissions and try again.',
//       );
//       return null;
//     }
//   };

//   // Convert speech to text using Web Speech API
//   const convertSpeechToText = (audioBlob) => {
//     return new Promise((resolve) => {
//       // Note: For production, you'd want to use a proper speech-to-text API
//       // This is a simplified version using the Web Speech API (browser support varies)

//       if (
//         !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
//       ) {
//         alert(
//           'Speech recognition is not supported in your browser. Please try Chrome or Edge.',
//         );
//         resolve('');
//         return;
//       }

//       const SpeechRecognition =
//         window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();

//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput((prev) => prev + (prev ? ' ' + transcript : transcript));
//         resolve(transcript);
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         if (event.error === 'not-allowed') {
//           alert(
//             'Microphone permission denied. Please allow microphone access and try again.',
//           );
//         }
//         resolve('');
//       };

//       recognition.onend = () => {
//         resolve('');
//       };

//       // For demo purposes, we'll simulate transcription since Web Speech API
//       // typically works with direct microphone input rather than audio blobs
//       // In a real app, you'd send the audioBlob to a speech-to-text service
//       setTimeout(() => {
//         alert(
//           'Voice recording completed! In a production app, this would be converted to text using a speech-to-text API.',
//         );
//         resolve('');
//       }, 500);
//     });
//   };

//   // Start recording
//   const startRecording = async () => {
//     try {
//       const recorder = await initializeMediaRecorder();
//       if (!recorder) return;

//       const chunks = [];
//       setAudioChunks(chunks);
//       setRecordingTime(0);

//       // Start recording
//       recorder.start(1000); // Collect data every second
//       setIsRecording(true);

//       // Start recording timer
//       recordingIntervalRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1);
//       }, 1000);
//     } catch (error) {
//       console.error('Error starting recording:', error);
//       setIsRecording(false);
//     }
//   };

//   // Stop recording
//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state === 'recording') {
//       mediaRecorder.stop();
//     }

//     if (recordingIntervalRef.current) {
//       clearInterval(recordingIntervalRef.current);
//       recordingIntervalRef.current = null;
//     }

//     setIsRecording(false);
//     setRecordingTime(0);
//   };

//   // Toggle recording
//   const toggleRecording = async () => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       await startRecording();
//     }
//   };

//   // Handle image selection
//   const handleImageSelect = (file) => {
//     if (file && onImageSelect) {
//       onImageSelect(file);
//     }
//   };

//   // Handle file input change
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleImageSelect(file);
//     }
//     e.target.value = ''; // Reset input
//   };

//   // Handle drag and drop
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       const file = files[0];
//       if (file.type.startsWith('image/')) {
//         handleImageSelect(file);
//       } else {
//         alert('Please drop an image file');
//       }
//     }
//   };

//   // Handle send button click
//   const handleSendClick = () => {
//     if (!isLoading && (input.trim() || hasImage)) {
//       onSend();
//       // Auto-resize textarea
//       if (textareaRef.current) {
//         textareaRef.current.style.height = 'auto';
//       }
//     }
//   };

//   // Auto-resize textarea
//   const handleTextareaChange = (e) => {
//     setInput(e.target.value);

//     // Auto-resize
//     const textarea = e.target;
//     textarea.style.height = 'auto';
//     textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
//   };

//   // Handle key press in textarea
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       onKeyPress(e);
//     }
//   };

//   // Clear input
//   const clearInput = () => {
//     setInput('');
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//     }
//   };

//   // Format recording time
//   const formatRecordingTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs
//       .toString()
//       .padStart(2, '0')}`;
//   };

//   return (
//     <div className="w-full">
//       {/* Drag and Drop Overlay */}
//       {isDragging && (
//         <div
//           className="fixed inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 flex items-center justify-center z-50"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <div className="text-center bg-gray-900/90 p-8 rounded-lg">
//             <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
//             <p className="text-white text-lg font-semibold">
//               Drop image to analyze
//             </p>
//             <p className="text-gray-300">Supported formats: JPG, PNG, WebP</p>
//           </div>
//         </div>
//       )}

//       {/* Input Container */}
//       <div
//         className={`
//           relative w-full rounded-xl transition-all duration-200
//           ${
//             isDragging
//               ? 'bg-blue-500/10 border-2 border-blue-400'
//               : 'bg-gray-800/50'
//           }
//         `}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         {/* Recording Indicator */}
//         {isRecording && (
//           <div className="flex items-center gap-2 px-4 pt-3 pb-2">
//             <div className="flex items-center gap-2 text-red-400 text-sm">
//               <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
//               <span>Recording... {formatRecordingTime(recordingTime)}</span>
//             </div>
//             <button
//               onClick={stopRecording}
//               className="text-gray-400 hover:text-white text-sm ml-auto"
//             >
//               Stop
//             </button>
//           </div>
//         )}

//         {/* Image Preview Indicator */}
//         {hasImage && !isRecording && (
//           <div className="flex items-center gap-2 px-4 pt-3 pb-2">
//             <div className="flex items-center gap-2 text-blue-400 text-sm">
//               <Image size={16} />
//               <span>Image ready for analysis</span>
//             </div>
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="text-gray-400 hover:text-white text-sm ml-auto"
//             >
//               Change
//             </button>
//           </div>
//         )}

//         {/* Text Input Area */}
//         <div className="flex items-end gap-2 p-3">
//           {/* Action Buttons */}
//           <div className="flex items-center gap-1 flex-shrink-0">
//             {/* Image Upload Button */}
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isLoading || isRecording}
//               className={`
//                 p-2 rounded-lg transition-all duration-200
//                 ${
//                   isLoading || isRecording
//                     ? 'text-gray-500 cursor-not-allowed'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }
//               `}
//               title="Upload image for analysis"
//             >
//               <Image size={20} />
//             </button>

//             {/* Voice Recording Button */}
//             <button
//               onClick={toggleRecording}
//               disabled={isLoading}
//               className={`
//                 p-2 rounded-lg transition-all duration-200
//                 ${
//                   isLoading
//                     ? 'text-gray-500 cursor-not-allowed'
//                     : isRecording
//                     ? 'text-red-400 bg-red-400/10 animate-pulse'
//                     : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
//                 }
//               `}
//               title={isRecording ? 'Stop recording' : 'Start voice recording'}
//             >
//               {isRecording ? <Square size={20} /> : <Mic size={20} />}
//             </button>
//           </div>

//           {/* Text Input */}
//           <div className="flex-1 relative">
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleTextareaChange}
//               onKeyDown={handleKeyDown}
//               placeholder={
//                 hasImage
//                   ? 'Ask me about this image...'
//                   : isRecording
//                   ? 'Recording in progress...'
//                   : 'Type your message...'
//               }
//               disabled={isLoading || isRecording}
//               rows={1}
//               className={`
//                 w-full resize-none bg-transparent text-white placeholder-gray-400
//                 border-none outline-none focus:ring-0 focus:outline-none
//                 max-h-32 overflow-y-auto scrollbar-thin
//                 ${
//                   isLoading || isRecording
//                     ? 'cursor-not-allowed opacity-50'
//                     : ''
//                 }
//               `}
//               style={{ height: 'auto' }}
//             />

//             {/* Clear Input Button (shown when there's text) */}
//             {input && !isLoading && !isRecording && (
//               <button
//                 onClick={clearInput}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 title="Clear input"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>

//           {/* Send Button */}
//           <button
//             onClick={handleSendClick}
//             disabled={isLoading || isRecording || (!input.trim() && !hasImage)}
//             className={`
//               flex items-center justify-center p-3 rounded-xl transition-all duration-200
//               transform active:scale-95
//               ${
//                 isLoading || isRecording || (!input.trim() && !hasImage)
//                   ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
//               }
//             `}
//             title="Send message"
//           >
//             {isLoading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <Send size={20} />
//             )}
//           </button>
//         </div>

//         {/* Character Count & Help Text */}
//         <div className="px-4 pb-2 flex justify-between items-center">
//           <div className="text-xs text-gray-500">
//             {input.length > 0 && `${input.length} characters`}
//           </div>
//           <div className="text-xs text-gray-500 flex items-center gap-2">
//             <span>↑↓ Navigate</span>
//             <span>•</span>
//             <span>Enter to send</span>
//           </div>
//         </div>
//       </div>

//       {/* Hidden File Input */}
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept="image/*"
//         className="hidden"
//       />

//       {/* Drag and Drop Hint */}
//     </div>
//   );
// };

// export default MessageInput;

import React, { useRef, useState } from 'react';
import { Send, Image, Mic, Paperclip } from 'lucide-react';

const MessageInput = ({
  input,
  setInput,
  isLoading,
  onSend,
  onKeyPress,
  hasImage,
  onImageSelect,
}) => {
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSend = () => {
    if (isListening) stopListening();
    onSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
    e.target.value = '';
  };

  // Simple voice input
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in your browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-2xl p-3">
      {/* Input Row */}
      <div className="flex items-end gap-2 w-full">
        {/* Image Upload Button */}
        <button
          onClick={handleImageClick}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 rounded-xl active:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          <Paperclip size={20} className="text-white" />
        </button>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="w-full bg-gray-700 text-white text-base placeholder-gray-400 rounded-xl px-4 py-3 resize-none min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            style={{ lineHeight: '1.4' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* Voice Button */}
        <button
          onClick={toggleVoice}
          disabled={isLoading}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-gray-700 text-white active:bg-gray-600'
          } disabled:opacity-50`}
        >
          <Mic size={20} />
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={(!input.trim() && !hasImage) || isLoading}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl active:bg-blue-700 disabled:opacity-50 disabled:bg-gray-600 transition-colors"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>

      {/* Image Upload Status */}
      {hasImage && (
        <div className="mt-2 px-3 py-2 bg-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Image size={16} className="text-blue-400" />
            <span className="text-blue-300 text-sm">Image ready to send</span>
          </div>
        </div>
      )}

      {/* Voice Listening Status */}
      {isListening && (
        <div className="mt-2 px-3 py-2 bg-red-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-300 text-sm">Listening... Speak now</span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;
