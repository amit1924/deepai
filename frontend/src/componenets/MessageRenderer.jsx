// import React, { useState, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/atom-one-dark.css';
// import { Check, Copy, Zap, Sparkles } from 'lucide-react';

// const MessageRenderer = ({ text }) => {
//   const [copied, setCopied] = useState(false);
//   const contentRef = useRef(null);

//   const copyMessage = async () => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   };

//   React.useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }, []);

//   return (
//     <div
//       ref={contentRef}
//       className="message-renderer relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm p-6 mb-6 animate-fade-in"
//     >
//       {/* Enhanced Floating Copy Button */}
//       <div className="absolute -top-3 -right-3 z-20">
//         <button
//           onClick={copyMessage}
//           className={`
//             flex items-center gap-2 px-2 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg
//             ${
//               copied
//                 ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
//                 : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-purple-500/30'
//             }
//           `}
//         >
//           {copied ? (
//             <>
//               <Check size={16} />
//               <span>Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy size={10} />
//               <span>Copy Code</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Decorative Elements */}
//       <div className="absolute top-4 left-4 opacity-10">
//         <Zap size={24} className="text-blue-400" />
//       </div>

//       <div className="absolute bottom-4 right-4 opacity-10">
//         <Sparkles size={24} className="text-purple-400" />
//       </div>

//       {/* Content Area with Enhanced Styling */}
//       <div className="pt-2">
//         <div
//           className="
//             message-content prose prose-invert max-w-none
//             w-full

//             /* Enhanced Typography */
//             prose-headings:font-bold prose-headings:tracking-tight
//             prose-h1:text-4xl prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-gray-700
//             prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8
//             prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
//             prose-h4:text-xl prose-h4:mb-3

//             /* Gradient Headings */
//             prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
//             prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
//             prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

//             /* Enhanced Content */
//             prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-4 prose-p:text-lg
//             prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:border prose-code:border-gray-700
//             prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:via-slate-900 prose-pre:to-gray-800 prose-pre:rounded-xl prose-pre:shadow-2xl
//             prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4
//             prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-orange-400
//             prose-ol:list-decimal prose-ol:pl-6 prose-ol:marker:text-indigo-400

//             /* Scrollable Tables */
//             prose-table:w-full prose-table:max-w-full prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap
//             prose-th:bg-gradient-to-r prose-th:from-slate-800 prose-th:to-gray-800 prose-th:text-blue-300 prose-th:font-bold
//             prose-td:px-6 prose-td:py-3 prose-td:border-b prose-td:border-gray-700 prose-td:text-gray-300 prose-td:even:bg-gray-800/30

//             /* Links & HR */
//             prose-a:text-blue-400 prose-a:no-underline prose-a:border-b prose-a:border-blue-400/30
//             prose-hr:border-gray-700 prose-hr:my-8
//           "
//         >
//           <ReactMarkdown
//             remarkPlugins={[remarkGfm]}
//             rehypePlugins={[rehypeHighlight]}
//             components={{
//               // Scrollable table wrapper
//               table: ({ children }) => (
//                 <div className="responsive-table scrollbar-thin rounded-lg border border-gray-700/50 my-4 shadow-lg">
//                   <table className="w-full min-w-full border-collapse">
//                     {children}
//                   </table>
//                 </div>
//               ),

//               // Enhanced code blocks with filename support
//               code({ node, inline, className, children, ...props }) {
//                 const match = /language-(\w+)/.exec(className || '');
//                 const filename = props.filename || null;

//                 return !inline && match ? (
//                   <div className="relative my-4">
//                     {filename && (
//                       <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-300 text-sm font-mono rounded-t-lg">
//                         <div className="w-2 h-2 bg-red-400 rounded-full"></div>
//                         <span>{filename}</span>
//                       </div>
//                     )}
//                     <pre
//                       className={`${className} overflow-x-auto scrollbar-thin`}
//                       {...props}
//                     >
//                       {children}
//                     </pre>
//                   </div>
//                 ) : (
//                   <code className={className} {...props}>
//                     {children}
//                   </code>
//                 );
//               },
//             }}
//           >
//             {text}
//           </ReactMarkdown>
//         </div>
//       </div>

//       {/* Footer with character count */}
//       <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
//         <div className="text-sm text-gray-500">{text.length} characters</div>
//       </div>
//     </div>
//   );
// };

// export default MessageRenderer;
//////////////////////////////////////////////
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import {
  Check,
  Copy,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const MessageRenderer = ({ text }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const contentRef = useRef(null);

  // Split content into sections based on headings
  const splitIntoSections = (content) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { title: 'Main Content', content: '', level: 0 };

    lines.forEach((line) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        // Save previous section
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        // Start new section
        currentSection = {
          title: headingMatch[2],
          content: line + '\n',
          level: headingMatch[1].length,
        };
      } else {
        currentSection.content += line + '\n';
      }
    });

    // Push the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }

    return sections.length > 0
      ? sections
      : [{ title: 'Content', content, level: 0 }];
  };

  const sections = splitIntoSections(text);

  const copySection = async (sectionIndex, sectionContent) => {
    try {
      await navigator.clipboard.writeText(sectionContent.trim());
      setCopiedSection(sectionIndex);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const isSectionExpanded = (sectionIndex) => {
    return expandedSections[sectionIndex] !== false; // Default to expanded
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Enhanced responsive design
  return (
    <div
      ref={contentRef}
      className="message-renderer relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm p-1 mb-6 animate-fade-in
                 sm:p-6"
    >
      {/* Main Copy Button for entire message */}
      <div className="absolute -top-3 -right-3 z-20 hidden sm:flex">
        <button
          onClick={() => copySection('full', text)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg
            ${
              copiedSection === 'full'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-purple-500/30'
            }
          `}
        >
          {copiedSection === 'full' ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy All</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile-friendly main copy button */}
      <div className="absolute -top-2 -right-2 z-20 sm:hidden">
        <button
          onClick={() => copySection('full', text)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 shadow-lg
            ${
              copiedSection === 'full'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }
          `}
        >
          {copiedSection === 'full' ? <Check size={12} /> : <Copy size={10} />}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-3 left-3 opacity-10 sm:top-4 sm:left-4">
        <Zap size={20} className="text-blue-400 sm:w-6 sm:h-6" />
      </div>

      <div className="absolute bottom-3 right-3 opacity-10 sm:bottom-4 sm:right-4">
        <Sparkles size={20} className="text-purple-400 sm:w-6 sm:h-6" />
      </div>

      {/* Content Area with Section-wise Copy */}
      <div className="pt-2">
        <div className="space-y-4 sm:space-y-6">
          {sections.map((section, index) => (
            <SectionBlock
              key={index}
              section={section}
              index={index}
              isExpanded={isSectionExpanded(index)}
              isCopied={copiedSection === index}
              onToggle={() => toggleSection(index)}
              onCopy={() => copySection(index, section.content)}
            />
          ))}
        </div>
      </div>

      {/* Footer with character count */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700/50 sm:mt-6 sm:pt-4">
        <div className="text-xs text-gray-500 sm:text-sm">
          {sections.length} section{sections.length !== 1 ? 's' : ''} •{' '}
          {text.length} chars
        </div>
        <div className="text-xs text-gray-500 sm:text-sm">
          Tap section headers to copy
        </div>
      </div>
    </div>
  );
};

// Individual Section Component
const SectionBlock = ({
  section,
  index,
  isExpanded,
  isCopied,
  onToggle,
  onCopy,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="section-block bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-gray-600/50">
      {/* Section Header - Clickable for copy and toggle */}
      <div
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer bg-gray-800/50 hover:bg-gray-700/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 w-2 h-2 rounded-full ${
              section.level === 1
                ? 'bg-pink-400'
                : section.level === 2
                ? 'bg-purple-400'
                : section.level === 3
                ? 'bg-cyan-400'
                : 'bg-blue-400'
            }`}
          />
          <h3 className="text-sm font-semibold text-gray-200 truncate sm:text-base">
            {section.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Copy Button for Section */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 transform hover:scale-105
              ${
                isCopied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-gray-600/50'
              }
            `}
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            {!isMobile && <span>{isCopied ? 'Copied!' : 'Copy'}</span>}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-3 sm:p-4 border-t border-gray-700/30">
          <div
            className={`
            message-content prose prose-invert max-w-none
            w-full
            
            /* Mobile-first responsive typography */
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-700
            sm:prose-h1:text-4xl sm:prose-h1:mb-6 sm:prose-h1:pb-3
            prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-4
            sm:prose-h2:text-3xl sm:prose-h2:mb-5 sm:prose-h2:mt-8
            prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-3
            sm:prose-h3:text-2xl sm:prose-h3:mb-4 sm:prose-h3:mt-6
            prose-h4:text-base prose-h4:mb-2
            sm:prose-h4:text-xl sm:prose-h4:mb-3
            
            /* Gradient Headings */
            prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
            prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

            /* Enhanced Content for mobile */
            prose-p:text-gray-300 prose-p:leading-7 prose-p:mb-3 prose-p:text-base
            sm:prose-p:leading-8 sm:prose-p:mb-4 sm:prose-p:text-lg
            prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-gray-700 prose-code:text-sm
            sm:prose-code:px-2 sm:prose-code:py-1 sm:prose-code:rounded-lg sm:prose-code:text-base
            prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:via-slate-900 prose-pre:to-gray-800 prose-pre:rounded-lg prose-pre:shadow-xl
            sm:prose-pre:rounded-xl
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-4 prose-blockquote:pr-3 prose-blockquote:py-3
            sm:prose-blockquote:pl-6 sm:prose-blockquote:pr-4 sm:prose-blockquote:py-4
            prose-ul:list-disc prose-ul:pl-4 prose-li:marker:text-orange-400 prose-li:mb-1
            sm:prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-4 prose-ol:marker:text-indigo-400 prose-ol:mb-1
            sm:prose-ol:pl-6

            /* Responsive Tables */
            prose-table:w-full prose-table:max-w-full prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap prose-table:text-sm
            sm:prose-table:text-base
            prose-th:bg-gradient-to-r prose-th:from-slate-800 prose-th:to-gray-800 prose-th:text-blue-300 prose-th:font-bold prose-th:px-3 prose-th:py-2
            sm:prose-th:px-6 sm:prose-th:py-3
            prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-gray-700 prose-td:text-gray-300 prose-td:even:bg-gray-800/30
            sm:prose-td:px-6 sm:prose-td:py-3

            /* Links & HR */
            prose-a:text-blue-400 prose-a:no-underline prose-a:border-b prose-a:border-blue-400/30
            prose-hr:border-gray-700 prose-hr:my-4
            sm:prose-hr:my-8
          `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                table: ({ children }) => (
                  <div className="responsive-table scrollbar-thin rounded-lg border border-gray-700/50 my-3 shadow-lg sm:my-4">
                    <table className="w-full min-w-full border-collapse">
                      {children}
                    </table>
                  </div>
                ),

                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const filename = props.filename || null;

                  return !inline && match ? (
                    <div className="relative my-3 sm:my-4">
                      {filename && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border-b border-gray-700 text-gray-300 text-xs font-mono rounded-t-lg sm:px-4 sm:py-2 sm:text-sm">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full sm:w-2 sm:h-2"></div>
                          <span>{filename}</span>
                        </div>
                      )}
                      <pre
                        className={`${className} overflow-x-auto scrollbar-thin text-sm sm:text-base`}
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
              {section.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageRenderer;
