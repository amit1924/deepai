import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy } from 'lucide-react';

const MessageRenderer = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative p-4 rounded-xl  shadow-xl backdrop-blur-lg">
      {/* Copy Full Response Button */}
      <button
        onClick={handleCopyAll}
        className="absolute  top-[-40px] right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300"
        title="Copy Response"
      >
        <Copy size={18} />
      </button>

      {copied && (
        <span className="absolute top-3 right-14 text-green-400 text-sm">
          Copied ✅
        </span>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-extrabold mb-4 text-pink-400"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold mb-3 text-indigo-400"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold mb-2 text-yellow-400"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="text-lg text-gray-200 mb-3 leading-relaxed"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-green-300 font-bold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="text-blue-300 italic" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc ml-6 space-y-2 text-lg text-teal-300"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal ml-6 space-y-2 text-lg text-purple-300"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-400 underline hover:text-blue-300 text-lg"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              className="bg-gray-800 border border-gray-600 w-full my-4 text-lg rounded-lg overflow-hidden"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="bg-gray-700 py-3 px-4 border border-gray-600 text-cyan-300 text-lg"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="py-3 px-4 border border-gray-700 text-gray-200 text-lg"
              {...props}
            />
          ),

          // ✅ Code with Copy Button
          code: ({ inline, children, ...props }) => {
            const content = String(children).replace(/\n$/, '');

            if (inline) {
              return (
                <code
                  className="bg-gray-800 px-2 py-1 rounded text-yellow-200 text-lg"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const [codeCopied, setCodeCopied] = useState(false);

            const copyCode = () => {
              navigator.clipboard.writeText(content);
              setCodeCopied(true);
              setTimeout(() => setCodeCopied(false), 1800);
            };

            return (
              <div className="relative my-4">
                <button
                  onClick={copyCode}
                  className="absolute bottom-[55px] right-[-25px] p-1 rounded-md  hover:bg-gray-800/90 text-xs text-white"
                >
                  {codeCopied ? 'Copied ✅' : <Copy size={14} />}
                </button>
                <pre className="bg-black/80 p-4 rounded-3xl overflow-x-auto text-base">
                  <code className="text-gray-200" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
