import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, Check } from 'lucide-react';

/* ---------------- STREAMING HOOK (CHATGPT STYLE) ---------------- */
const useStreamText = (text, speed = 20, enabled = true) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    const words = text.split(' ');
    let index = 0;

    setDisplayText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayText(prev => prev + (index === 0 ? '' : ' ') + words[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayText, isComplete };
};

/* ---------------- HELPER ---------------- */
const extractTextFromChildren = (children) => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (children?.props?.children) return extractTextFromChildren(children.props.children);
  return '';
};

/* ---------------- MAIN COMPONENT ---------------- */
const MessageRenderer = ({
  text,
  isNew = false,
  streamSpeed = 15,
}) => {
  const [codeCopiedStates, setCodeCopiedStates] = useState({});

  const { displayText, isComplete } = useStreamText(text, streamSpeed, isNew);

  const content = isNew ? displayText : text;
  const isTyping = isNew && !isComplete;

  const handleCopyCode = useCallback(async (id, content) => {
    await navigator.clipboard.writeText(content);
    setCodeCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCodeCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 1500);
  }, []);

  let codeIndex = 0;

  const components = {
    h1: (props) => <h1 className="text-3xl font-bold text-pink-400 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-semibold text-indigo-400 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-medium text-yellow-400 mb-2" {...props} />,
    p: (props) => <p className="text-gray-200 mb-3 leading-relaxed" {...props} />,

    ul: (props) => <ul className="list-disc ml-6 space-y-2 text-gray-300" {...props} />,
    ol: (props) => <ol className="list-decimal ml-6 space-y-2 text-gray-300" {...props} />,

    a: (props) => (
      <a className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props} />
    ),

    /* -------- TABLE FIX -------- */
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-700 text-sm">{children}</table>
      </div>
    ),

    th: (props) => <th className="bg-gray-700 px-4 py-2 text-cyan-300 border" {...props} />,
    td: (props) => <td className="px-4 py-2 border text-gray-200" {...props} />,

    /* -------- CODE BLOCK -------- */
    code: ({ inline, children, className, node }) => {
      const content = extractTextFromChildren(children);

      if (inline) {
        return (
          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-yellow-300">
            {children}
          </code>
        );
      }

      const id = `code-${codeIndex++}`;
      const copied = codeCopiedStates[id];

      return (
        <div className="relative my-4 rounded-xl overflow-hidden">
          {/* COPY BUTTON */}
          <button
            onClick={() => handleCopyCode(id, content)}
            className="absolute top-2 right-2 bg-gray-800 px-2 py-1 rounded text-xs text-white"
          >
            {copied ? 'Copied ✅' : 'Copy'}
          </button>

          <pre className="bg-[#0d1117] p-4 overflow-x-auto text-sm">
            <code className={className}>{children}</code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl shadow-xl">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>

      {/* 🔥 ChatGPT-like typing indicator */}
      {isTyping && (
        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
      )}
    </div>
  );
};

export default MessageRenderer;