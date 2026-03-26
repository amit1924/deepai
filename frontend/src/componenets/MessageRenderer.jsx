import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, Check } from 'lucide-react';

const MessageRenderer = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopiedStates, setCodeCopiedStates] = useState({});

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [text]);

  const handleCopyCode = useCallback(async (codeId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCodeCopiedStates(prev => ({ ...prev, [codeId]: true }));
      setTimeout(() => {
        setCodeCopiedStates(prev => ({ ...prev, [codeId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, []);

  // Helper function to extract text from React children
  const extractTextFromChildren = (children) => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);
    if (Array.isArray(children)) {
      return children.map(child => extractTextFromChildren(child)).join('');
    }
    if (React.isValidElement(children)) {
      return extractTextFromChildren(children.props.children);
    }
    return '';
  };

  let codeBlockCounter = 0;

  const components = {
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 mt-6 first:mt-0 text-pink-400" {...props}>
        {children}
      </h1>
    ),
    
    h2: ({ children, ...props }) => (
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 mt-5 first:mt-0 text-indigo-400" {...props}>
        {children}
      </h2>
    ),
    
    h3: ({ children, ...props }) => (
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 mt-4 first:mt-0 text-yellow-400" {...props}>
        {children}
      </h3>
    ),
    
    p: ({ children, ...props }) => (
      <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-3 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    
    strong: ({ children, ...props }) => (
      <strong className="text-green-300 font-bold" {...props}>
        {children}
      </strong>
    ),
    
    em: ({ children, ...props }) => (
      <em className="text-blue-300 italic" {...props}>
        {children}
      </em>
    ),
    
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-4 sm:pl-5 md:pl-6 mb-3 space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-teal-300" {...props}>
        {children}
      </ul>
    ),
    
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-4 sm:pl-5 md:pl-6 mb-3 space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-purple-300" {...props}>
        {children}
      </ol>
    ),
    
    li: ({ children, ...props }) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    
    a: ({ children, href, ...props }) => (
      <a
        className="text-blue-400 underline hover:text-blue-300 transition-colors text-sm sm:text-base md:text-lg break-all"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    
    table: ({ children, ...props }) => (
      <div className="w-full my-4 overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg" {...props}>
          {children}
        </table>
      </div>
    ),
    
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    
    tbody: ({ children, ...props }) => (
      <tbody className="bg-gray-900/50" {...props}>
        {children}
      </tbody>
    ),
    
    tr: ({ children, ...props }) => (
      <tr className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors" {...props}>
        {children}
      </tr>
    ),
    
    th: ({ children, ...props }) => (
      <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-cyan-300 font-semibold text-sm sm:text-base border-r border-gray-700 last:border-r-0" {...props}>
        {children}
      </th>
    ),
    
    td: ({ children, ...props }) => (
      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-200 text-sm sm:text-base border-r border-gray-700 last:border-r-0" {...props}>
        {children}
      </td>
    ),
    
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-1 my-3 bg-gray-800/30 rounded-r-lg text-gray-300 text-sm sm:text-base" {...props}>
        {children}
      </blockquote>
    ),
    
    hr: () => (
      <hr className="my-4 sm:my-6 border-gray-700" />
    ),
    
    img: ({ src, alt, ...props }) => (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg my-3"
        loading="lazy"
        {...props} 
      />
    ),
    
    code: ({ inline, children, className, ...props }) => {
      // Extract plain text content from React children
      const content = extractTextFromChildren(children);
      
      if (inline) {
        return (
          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-yellow-200 text-sm sm:text-base font-mono" {...props}>
            {children}
          </code>
        );
      }
      
      const codeId = `code-${codeBlockCounter++}`;
      const isCopied = codeCopiedStates[codeId];
      const language = className ? className.replace('language-', '') : 'text';
      
      return (
        <div className="relative my-3 sm:my-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-gray-700">
            <span className="text-xs sm:text-sm text-gray-400 font-mono uppercase">
              {language}
            </span>
            <button
              onClick={() => handleCopyCode(codeId, content)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white text-xs sm:text-sm"
              title="Copy code"
            >
              {isCopied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="bg-gray-900 p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono">
            <code className={`text-gray-200 ${className || ''}`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div className="relative bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
      <div className="sticky top-0 z-10 flex justify-end p-2 bg-gray-900/80 backdrop-blur-sm rounded-t-xl border-b border-gray-700">
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all text-gray-300 hover:text-white text-sm"
          title="Copy full response"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageRenderer;