// import React, { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/vs2015.css'; // or any theme

// const MessageRenderer = ({ text }) => {
//   const [copied, setCopied] = useState(false);

//   const copyMessage = async () => {
//     await navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="message-renderer">
//       <div className="message-copy-container">
//         <button onClick={copyMessage} className="message-copy-full-button">
//           {copied ? '✅ Copied!' : '📋 Copy Message'}
//         </button>
//       </div>

//       <div className="message-content prose prose-invert max-w-none">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           rehypePlugins={[rehypeHighlight]}
//         >
//           {text}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// };

// export default MessageRenderer;

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css'; // try 'atom-one-dark.css' for more color

const MessageRenderer = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="message-renderer">
      {/* 📋 Copy button */}
      <div className="message-copy-container mb-2 ">
        <button
          onClick={copyMessage}
          className="px-3 py-1 rounded-lg bg-gray-700 text-sm hover:bg-gray-600 transition "
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* 📝 Render markdown with colorful custom Tailwind styles */}
      <div
        className="
          message-content prose prose-invert max-w-none

          /* 🎨 Headings */
          prose-h1:text-3xl prose-h1:font-bold prose-h1:text-pink-400
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-purple-400
          prose-h3:text-xl prose-h3:font-medium prose-h3:text-cyan-400

          /* 📝 Paragraphs */
          prose-p:leading-relaxed prose-p:text-gray-200

          /* ✨ Bold + Inline Code */
          prose-strong:text-yellow-300
          prose-code:bg-gray-800 prose-code:text-green-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded

          /* 📦 Code Blocks */
          prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-xl prose-pre:shadow-lg

          /* 💬 Blockquotes */
          prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:text-emerald-300

          /* 🔵 Unordered Lists */
          prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-orange-400 prose-li:text-gray-200

          /* 🔢 Ordered Lists */
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:marker:text-indigo-400 prose-li:text-gray-200

          /* 📊 Tables */
          prose-table:border prose-table:border-gray-700
          prose-th:bg-slate-700 prose-th:text-pink-300 prose-th:px-3 prose-th:py-2
          prose-td:border prose-td:border-gray-700 prose-td:px-3 prose-td:py-2 prose-td:text-gray-300
        "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // GitHub-style Markdown (tables, checklists, etc.)
          rehypePlugins={[rehypeHighlight]} // Syntax highlighting
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageRenderer;
