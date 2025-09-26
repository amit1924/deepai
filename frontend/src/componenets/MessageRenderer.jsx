import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { Check, Copy, Zap, Sparkles } from 'lucide-react';

const MessageRenderer = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return (
    <div
      ref={contentRef}
      className="message-renderer relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm p-6 mb-6 animate-fade-in"
    >
      {/* Enhanced Floating Copy Button */}
      <div className="absolute -top-3 -right-3 z-20">
        <button
          onClick={copyMessage}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg
            ${
              copied
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-purple-500/30'
            }
          `}
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 opacity-10">
        <Zap size={24} className="text-blue-400" />
      </div>

      <div className="absolute bottom-4 right-4 opacity-10">
        <Sparkles size={24} className="text-purple-400" />
      </div>

      {/* Content Area with Enhanced Styling */}
      <div className="pt-2">
        <div
          className="
            message-content prose prose-invert max-w-none
            w-full
            
            /* Enhanced Typography */
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-gray-700
            prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
            prose-h4:text-xl prose-h4:mb-3
            
            /* Gradient Headings */
            prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
            prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

            /* Enhanced Content */
            prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-4 prose-p:text-lg
            prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:border prose-code:border-gray-700
            prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:via-slate-900 prose-pre:to-gray-800 prose-pre:rounded-xl prose-pre:shadow-2xl
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4
            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-orange-400
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:marker:text-indigo-400

            /* Scrollable Tables */
            prose-table:w-full prose-table:max-w-full prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap
            prose-th:bg-gradient-to-r prose-th:from-slate-800 prose-th:to-gray-800 prose-th:text-blue-300 prose-th:font-bold
            prose-td:px-6 prose-td:py-3 prose-td:border-b prose-td:border-gray-700 prose-td:text-gray-300 prose-td:even:bg-gray-800/30

            /* Links & HR */
            prose-a:text-blue-400 prose-a:no-underline prose-a:border-b prose-a:border-blue-400/30
            prose-hr:border-gray-700 prose-hr:my-8
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Scrollable table wrapper
              table: ({ children }) => (
                <div className="responsive-table scrollbar-thin rounded-lg border border-gray-700/50 my-4 shadow-lg">
                  <table className="w-full min-w-full border-collapse">
                    {children}
                  </table>
                </div>
              ),

              // Enhanced code blocks with filename support
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const filename = props.filename || null;

                return !inline && match ? (
                  <div className="relative my-4">
                    {filename && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-300 text-sm font-mono rounded-t-lg">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>{filename}</span>
                      </div>
                    )}
                    <pre
                      className={`${className} overflow-x-auto scrollbar-thin`}
                      {...props}
                    >
                      {children}
                    </pre>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer with character count */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
        <div className="text-sm text-gray-500">{text.length} characters</div>
      </div>
    </div>
  );
};

export default MessageRenderer;
