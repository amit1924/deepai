import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, Check } from 'lucide-react';

// Typewriter effect hook
const useTypewriter = (text, speed = 30, enabled = true) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    // Reset when text changes
    setDisplayText('');
    setIsComplete(false);
    indexRef.current = 0;

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        setDisplayText(prev => prev + text[indexRef.current]);
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeoutRef.current = setTimeout(typeNextChar, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, enabled]);

  return { displayText, isComplete };
};

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

const MessageRenderer = ({ text, enableTypewriter = true, typewriterSpeed = 25 }) => {
  const [codeCopiedStates, setCodeCopiedStates] = useState({});
  const { displayText, isComplete } = useTypewriter(text, typewriterSpeed, enableTypewriter);
  
  // Use displayText for typewriter effect, fallback to original text
  const contentToRender = enableTypewriter ? displayText : text;
  const isTyping = enableTypewriter && !isComplete;

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

  let codeBlockCounter = 0;

  const components = {
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 mt-8 first:mt-0 text-pink-400 leading-tight" {...props}>
        {children}
      </h1>
    ),
    
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 mt-7 first:mt-0 text-indigo-400 leading-tight" {...props}>
        {children}
      </h2>
    ),
    
    h3: ({ children, ...props }) => (
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 mt-6 first:mt-0 text-yellow-400 leading-tight" {...props}>
        {children}
      </h3>
    ),
    
    p: ({ children, ...props }) => (
      <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-5 leading-relaxed" {...props}>
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
      <ul className="list-disc pl-6 sm:pl-7 md:pl-8 mb-5 space-y-2 text-base sm:text-lg md:text-xl text-teal-300" {...props}>
        {children}
      </ul>
    ),
    
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 sm:pl-7 md:pl-8 mb-5 space-y-2 text-base sm:text-lg md:text-xl text-purple-300" {...props}>
        {children}
      </ol>
    ),
    
    li: ({ children, ...props }) => (
      <li className="mb-2 leading-relaxed" {...props}>
        {children}
      </li>
    ),
    
    a: ({ children, href, ...props }) => (
      <a
        className="text-blue-400 underline hover:text-blue-300 transition-colors text-base sm:text-lg md:text-xl break-words"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    
    table: ({ children, ...props }) => (
      <div className="w-full my-6 overflow-x-auto">
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
      <th className="py-3 sm:py-4 px-4 sm:px-5 text-left text-cyan-300 font-semibold text-sm sm:text-base md:text-lg border-r border-gray-700 last:border-r-0" {...props}>
        {children}
      </th>
    ),
    
    td: ({ children, ...props }) => (
      <td className="py-3 sm:py-4 px-4 sm:px-5 text-gray-200 text-sm sm:text-base md:text-lg border-r border-gray-700 last:border-r-0" {...props}>
        {children}
      </td>
    ),
    
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 sm:pl-5 py-2 my-4 bg-gray-800/30 rounded-r-lg text-gray-300 text-base sm:text-lg md:text-xl" {...props}>
        {children}
      </blockquote>
    ),
    
    hr: () => (
      <hr className="my-6 sm:my-8 border-gray-700" />
    ),
    
    img: ({ src, alt, ...props }) => (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg my-4"
        loading="lazy"
        {...props} 
      />
    ),
    
    code: ({ inline, children, className, ...props }) => {
      const content = extractTextFromChildren(children);
      
      if (inline) {
        return (
          <code className="bg-gray-800 px-2 py-0.5 rounded text-yellow-200 text-sm sm:text-base md:text-lg font-mono" {...props}>
            {children}
          </code>
        );
      }
      
      const codeId = `code-${codeBlockCounter++}`;
      const isCopied = codeCopiedStates[codeId];
      const language = className ? className.replace('language-', '') : 'code';
      
      return (
        <div className="relative my-6 rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center justify-between bg-gray-900 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-gray-700">
            <span className="text-xs sm:text-sm text-gray-400 font-mono uppercase tracking-wider">
              {language}
            </span>
            <button
              onClick={() => handleCopyCode(codeId, content)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-all text-gray-300 hover:text-white text-sm sm:text-base font-medium"
              title="Copy code"
            >
              {isCopied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="bg-gray-900 p-4 sm:p-5 overflow-x-auto text-sm sm:text-base md:text-lg font-mono leading-relaxed">
            <code className={`text-gray-200 ${className || ''}`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div className="relative bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700">
      <div className="p-5 sm:p-6 md:p-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {contentToRender}
        </ReactMarkdown>
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="inline-flex items-center gap-1 mt-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageRenderer;