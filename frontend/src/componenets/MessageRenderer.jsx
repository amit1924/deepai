// import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/atom-one-dark.css';
// import {
//   Check,
//   Copy,
//   ChevronDown,
//   ChevronUp,
//   Smartphone,
//   Monitor,
// } from 'lucide-react';

// const MessageRenderer = ({ text }) => {
//   const [copiedSection, setCopiedSection] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({});
//   const [tableView, setTableView] = useState('auto'); // 'auto', 'card', 'table'
//   const contentRef = useRef(null);

//   const splitIntoSections = (content) => {
//     const sections = [];
//     const lines = content.split('\n');
//     let currentSection = { title: 'Main Content', content: '', level: 0 };

//     lines.forEach((line) => {
//       const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
//       if (headingMatch) {
//         if (currentSection.content.trim()) {
//           sections.push({ ...currentSection });
//         }
//         currentSection = {
//           title: headingMatch[2],
//           content: line + '\n',
//           level: headingMatch[1].length,
//         };
//       } else {
//         currentSection.content += line + '\n';
//       }
//     });

//     if (currentSection.content.trim()) {
//       sections.push(currentSection);
//     }

//     return sections.length > 0
//       ? sections
//       : [{ title: 'Content', content, level: 0 }];
//   };

//   const sections = splitIntoSections(text);

//   const copySection = async (sectionIndex, sectionContent) => {
//     try {
//       await navigator.clipboard.writeText(sectionContent.trim());
//       setCopiedSection(sectionIndex);
//       setTimeout(() => setCopiedSection(null), 2000);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   };

//   const toggleSection = (sectionIndex) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionIndex]: !prev[sectionIndex],
//     }));
//   };

//   const isSectionExpanded = (sectionIndex) => {
//     return expandedSections[sectionIndex] !== false;
//   };

//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }, []);

//   // Check if content has tables
//   const hasTables = text.includes('|') && text.includes('-');

//   return (
//     <div
//       ref={contentRef}
//       className="message-renderer relative p-4 mb-4 animate-fade-in sm:p-6"
//     >
//       {/* Header with View Controls */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-sm text-gray-400">
//           {sections.length} section{sections.length !== 1 ? 's' : ''}
//         </div>

//         {/* {hasTables && (
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-500 hidden sm:block">
//               Table view:
//             </span>
//             <div className="flex bg-gray-800 rounded-lg p-1">
//               <button
//                 onClick={() => setTableView('auto')}
//                 className={`p-1 rounded text-xs transition-colors ${
//                   tableView === 'auto'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//                 title="Auto (Cards on mobile)"
//               >
//                 <Smartphone size={14} />
//               </button>
//               <button
//                 onClick={() => setTableView('table')}
//                 className={`p-1 rounded text-xs transition-colors ${
//                   tableView === 'table'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//                 title="Always table view"
//               >
//                 <Monitor size={14} />
//               </button>
//             </div>
//           </div>
//         )} */}
//       </div>

//       {/* Main Copy Button */}
//       <div className="absolute top-2 right-2 z-20">
//         <button
//           onClick={() => copySection('full', text)}
//           className={`
//             flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
//             ${
//               copiedSection === 'full'
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//             }
//           `}
//         >
//           {copiedSection === 'full' ? (
//             <>
//               <Check size={16} />
//               <span>Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy size={14} />
//               <span>Copy All</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="pt-2">
//         <div className="space-y-4">
//           {sections.map((section, index) => (
//             <SectionBlock
//               key={index}
//               section={section}
//               index={index}
//               isExpanded={isSectionExpanded(index)}
//               isCopied={copiedSection === index}
//               onToggle={() => toggleSection(index)}
//               onCopy={() => copySection(index, section.content)}
//               tableView={tableView}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-4 pt-3 text-gray-500 text-sm">
//         {hasTables && (
//           <div className="text-xs text-gray-500 sm:hidden">
//             💡 Tables shown as cards on mobile
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const SectionBlock = ({
//   section,
//   index,
//   isExpanded,
//   isCopied,
//   onToggle,
//   onCopy,
//   tableView,
// }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Custom table renderer for mobile
//   const TableRenderer = ({ children }) => {
//     const [tableHeaders, setTableHeaders] = useState([]);
//     const [tableRows, setTableRows] = useState([]);
//     const tableRef = useRef(null);

//     useEffect(() => {
//       if (tableRef.current) {
//         const table = tableRef.current;
//         const headers = Array.from(table.querySelectorAll('thead th')).map(
//           (th) => th.textContent.trim(),
//         );
//         const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) =>
//           Array.from(tr.querySelectorAll('td')).map((td) =>
//             td.textContent.trim(),
//           ),
//         );

//         setTableHeaders(headers);
//         setTableRows(rows);
//       }
//     }, [children]);

//     const shouldUseCards =
//       tableView === 'auto' ? isMobile : tableView === 'card';

//     if (shouldUseCards && tableHeaders.length > 0 && tableRows.length > 0) {
//       return (
//         <div className="mobile-table-cards space-y-3 my-4">
//           {tableRows.map((row, rowIndex) => (
//             <div
//               key={rowIndex}
//               className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
//             >
//               <div className="space-y-2">
//                 {row.map((cell, cellIndex) => (
//                   <div key={cellIndex} className="flex flex-col sm:flex-row">
//                     <div className="text-sm font-semibold text-blue-300 mb-1 sm:mb-0 sm:w-1/3 sm:pr-2">
//                       {tableHeaders[cellIndex]}
//                     </div>
//                     <div className="text-gray-200 text-sm sm:w-2/3">{cell}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return (
//       <div className="table-container overflow-x-auto my-4 rounded-lg border border-gray-700">
//         <div className="min-w-full">
//           <table
//             ref={tableRef}
//             className="w-full border-collapse text-sm sm:text-base"
//           >
//             {children}
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="section-block rounded-lg overflow-hidden">
//       {/* Section Header */}
//       <div
//         className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-lg"
//         onClick={onToggle}
//       >
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           <div
//             className={`flex-shrink-0 w-2 h-2 rounded-full ${
//               section.level === 1
//                 ? 'bg-pink-400'
//                 : section.level === 2
//                 ? 'bg-purple-400'
//                 : section.level === 3
//                 ? 'bg-cyan-400'
//                 : 'bg-blue-400'
//             }`}
//           />
//           <h3 className="text-sm font-semibold text-gray-200 truncate sm:text-base">
//             {section.title}
//           </h3>
//         </div>

//         <div className="flex items-center gap-2 flex-shrink-0">
//           {/* Copy Button for Section */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onCopy();
//             }}
//             className={`
//               flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200
//               ${
//                 isCopied
//                   ? 'bg-green-600 text-white'
//                   : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
//               }
//             `}
//           >
//             {isCopied ? <Check size={12} /> : <Copy size={12} />}
//             {!isMobile && <span>{isCopied ? 'Copied!' : 'Copy'}</span>}
//           </button>

//           {/* Expand/Collapse Toggle */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggle();
//             }}
//             className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
//           >
//             {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </button>
//         </div>
//       </div>

//       {/* Section Content */}
//       {isExpanded && (
//         <div className="p-3">
//           <div
//             className={`
//             message-content prose prose-invert max-w-none w-full
//             prose-headings:font-bold prose-headings:tracking-tight
//             prose-h1:text-xl prose-h1:mb-3
//             sm:prose-h1:text-2xl sm:prose-h1:mb-4
//             prose-h2:text-lg prose-h2:mb-2 prose-h2:mt-3
//             sm:prose-h2:text-xl sm:prose-h2:mb-3 sm:prose-h2:mt-4
//             prose-h3:text-base prose-h3:mb-2 prose-h3:mt-2
//             sm:prose-h3:text-lg sm:prose-h3:mb-2 sm:prose-h3:mt-3

//             prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
//             prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
//             prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

//             prose-p:text-gray-300 prose-p:leading-6 prose-p:mb-3 prose-p:text-sm
//             sm:prose-p:leading-7 sm:prose-p:mb-4 sm:prose-p:text-base
//             prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
//             prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:overflow-x-auto
//             prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-3
//             prose-ul:list-disc prose-ul:pl-4 prose-li:marker:text-orange-400 prose-li:mb-1
//             prose-ol:list-decimal prose-ol:pl-4 prose-ol:marker:text-indigo-400 prose-ol:mb-1

//             /* Enhanced table styles */
//             prose-table:w-full
//             prose-thead:bg-gray-800
//             prose-th:text-blue-300 prose-th:font-bold prose-th:px-3 prose-th:py-3 prose-th:text-left
//             prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-gray-700 prose-td:text-gray-300
//             prose-tbody tr:hover:bg-gray-800/50

//             prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
//             prose-hr:border-gray-700 prose-hr:my-4
//           `}
//           >
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]}
//               rehypePlugins={[rehypeHighlight]}
//               components={{
//                 table: ({ children }) => (
//                   <TableRenderer>{children}</TableRenderer>
//                 ),

//                 thead: ({ children }) => (
//                   <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
//                     {children}
//                   </thead>
//                 ),

//                 tbody: ({ children }) => (
//                   <tbody className="divide-y divide-gray-700">{children}</tbody>
//                 ),

//                 code({ node, inline, className, children, ...props }) {
//                   const match = /language-(\w+)/.exec(className || '');
//                   const filename = props.filename || null;

//                   return !inline && match ? (
//                     <div className="relative my-3">
//                       {filename && (
//                         <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-mono rounded-t-lg">
//                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
//                           <span>{filename}</span>
//                         </div>
//                       )}
//                       <pre
//                         className={`${className} overflow-x-auto text-sm p-3 scrollbar-thin`}
//                         {...props}
//                       >
//                         {children}
//                       </pre>
//                     </div>
//                   ) : (
//                     <code className={className} {...props}>
//                       {children}
//                     </code>
//                   );
//                 },
//               }}
//             >
//               {section.content}
//             </ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageRenderer;

// import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/atom-one-dark.css'; // Or your preferred highlight.js theme
// import { Check, Copy, ChevronDown, ChevronUp, Zap } from 'lucide-react'; // Using only necessary icons

// const MessageRenderer = ({ text }) => {
//   const [copiedSection, setCopiedSection] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({});
//   const contentRef = useRef(null); // Ref for scrolling to the top of the message

//   // Function to split content into sections based on Markdown headings
//   const splitIntoSections = (content) => {
//     const sections = [];
//     const lines = content.split('\n');
//     let currentSection = { title: 'Main Content', content: '', level: 0 }; // Default section

//     lines.forEach((line) => {
//       const headingMatch = line.match(/^(#{1,6})\s+(.+)$/); // Match headings
//       if (headingMatch) {
//         // If current section has content, push it before starting a new one
//         if (currentSection.content.trim()) {
//           sections.push({ ...currentSection });
//         }
//         // Start a new section
//         currentSection = {
//           title: headingMatch[2],
//           content: line + '\n', // Include the heading line in its section content
//           level: headingMatch[1].length,
//         };
//       } else {
//         currentSection.content += line + '\n';
//       }
//     });

//     // Push the last section if it has content
//     if (currentSection.content.trim()) {
//       sections.push(currentSection);
//     }

//     // Fallback: if no sections were found (e.g., plain text), treat as a single content block
//     return sections.length > 0
//       ? sections
//       : [{ title: 'Response', content, level: 0 }];
//   };

//   const sections = splitIntoSections(text);

//   // Handle copying content to clipboard
//   const copySection = async (sectionId, sectionContent) => {
//     try {
//       await navigator.clipboard.writeText(sectionContent.trim());
//       setCopiedSection(sectionId);
//       setTimeout(() => setCopiedSection(null), 2000); // Reset copied state after 2 seconds
//     } catch (err) {
//       console.error('Failed to copy text:', err);
//       // Optionally show a user-friendly error message
//     }
//   };

//   // Toggle section expansion state
//   const toggleSection = (sectionIndex) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionIndex]: !prev[sectionIndex],
//     }));
//   };

//   // Check if a section is expanded (default to true if not set)
//   const isSectionExpanded = (sectionIndex) => {
//     return expandedSections[sectionIndex] !== false;
//   };

//   // Scroll to the top of the message when component mounts or text changes
//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }, [text]); // Re-run if the text prop changes

//   return (
//     <div
//       ref={contentRef}
//       className="message-renderer relative p-4 mb-4rounded-lg shadow-lg animate-fade-in sm:p-6"
//     >
//       {/* Main Copy Button for entire message */}
//       <div className="absolute top-3 right-3 z-20">
//         <button
//           onClick={() => copySection('full', text)}
//           className={`
//             flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
//             ${
//               copiedSection === 'full'
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
//             }
//           `}
//           aria-label="Copy entire message"
//         >
//           {copiedSection === 'full' ? (
//             <>
//               <Check size={16} />
//               <span>Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy size={14} />
//               <span>Copy All</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="pt-10">
//         {' '}
//         {/* Added padding top to account for global copy button */}
//         <div className="space-y-4">
//           {sections.map((section, index) => (
//             <SectionBlock
//               key={index}
//               section={section}
//               index={index}
//               isExpanded={isSectionExpanded(index)}
//               isCopied={copiedSection === index}
//               onToggle={() => toggleSection(index)}
//               onCopy={() => copySection(index, section.content)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       {/* <div className="flex justify-between items-center mt-6 pt-3 text-gray-500 text-xs border-t border-gray-700">
//         <div>
//           {sections.length} section{sections.length !== 1 ? 's' : ''} •{' '}
//           {text.length} characters
//         </div>
//         <div className="flex items-center gap-1 text-blue-400">
//           <Zap size={12} /> Powered by AI
//         </div>
//       </div> */}
//     </div>
//   );
// };

// // SectionBlock component to render individual collapsible sections
// const SectionBlock = ({
//   section,
//   index,
//   isExpanded,
//   isCopied,
//   onToggle,
//   onCopy,
// }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640);
//     checkMobile(); // Set initial state
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   return (
//     <div className="section-block rounded-lg overflow-hidden">
//       {/* Section Header */}
//       <div
//         className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700/60 transition-colors rounded-t-lg"
//         onClick={onToggle}
//         role="button"
//         aria-expanded={isExpanded}
//         aria-controls={`section-content-${index}`}
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             onToggle();
//           }
//         }}
//       >
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           {/* Visual indicator for heading level */}
//           <div
//             className={`flex-shrink-0 w-2.5 h-2.5 rounded-full
//               ${
//                 section.level === 1
//                   ? 'bg-pink-400'
//                   : section.level === 2
//                   ? 'bg-purple-400'
//                   : section.level === 3
//                   ? 'bg-cyan-400'
//                   : 'bg-blue-400'
//               }
//             `}
//           />
//           <h3 className="text-sm font-semibold text-gray-100 truncate sm:text-base">
//             {section.title || `Section ${index + 1}`} {/* Fallback title */}
//           </h3>
//         </div>

//         <div className="flex items-center gap-2 flex-shrink-0">
//           {/* Copy Button for Section */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // Prevent toggling section when copying
//               onCopy();
//             }}
//             className={`
//               flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200
//               ${
//                 isCopied
//                   ? 'bg-green-600 text-white'
//                   : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
//               }
//             `}
//             aria-label={`Copy section: ${section.title}`}
//           >
//             {isCopied ? <Check size={12} /> : <Copy size={12} />}
//             {!isMobile && <span>{isCopied ? 'Copied!' : 'Copy'}</span>}
//           </button>

//           {/* Expand/Collapse Toggle */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // Prevent toggling section when clicking chevron
//               onToggle();
//             }}
//             className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
//             aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
//           >
//             {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           </button>
//         </div>
//       </div>

//       {/* Section Content */}
//       {isExpanded && (
//         <div id={`section-content-${index}`} className="p-4 animate-fade-in-up">
//           <div
//             className={`
//             message-content prose prose-invert max-w-none w-full

//             prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-3
//             prose-h1:text-2xl sm:prose-h1:text-3xl
//             prose-h2:text-xl sm:prose-h2:text-2xl
//             prose-h3:text-lg sm:prose-h3:text-xl

//             prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
//             prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
//             prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

//             prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-3 prose-p:text-base
//             sm:prose-p:leading-loose sm:prose-p:mb-4

//             prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
//             prose-pre:bg-gray-950 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:p-4 prose-pre:overflow-x-auto

//             prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/60 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r

//             prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-orange-400 prose-ul:space-y-1.5
//             prose-ol:list-decimal prose-ol:pl-5 prose-ol:marker:text-indigo-400 prose-ol:space-y-1.5

//             /* Table specific styling for inner elements - the wrapper handles scroll */
//             prose-table:w-full prose-table:border-collapse prose-table:text-left
//             prose-th:bg-gray-700 prose-th:text-blue-300 prose-th:font-semibold prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-gray-600
//             prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-700 prose-td:text-gray-300

//             prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:underline-offset-4 prose-a:transition-colors
//             prose-hr:border-gray-700 prose-hr:my-6
//           `}
//           >
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]} // For GitHub Flavored Markdown (tables, task lists, etc.)
//               rehypePlugins={[rehypeHighlight]} // For syntax highlighting code blocks
//               components={{
//                 // Custom component for tables to ensure scrollability
//                 table: ({ children }) => (
//                   <div className="overflow-x-auto rounded-lg my-4 border border-gray-700 shadow-lg bg-gray-800">
//                     <table className="w-full min-w-full border-collapse text-sm">
//                       {children}
//                     </table>
//                   </div>
//                 ),
//                 // Custom component for code blocks (with filename support)
//                 code({ node, inline, className, children, ...props }) {
//                   const match = /language-(\w+)/.exec(className || '');
//                   const filename = props.filename || null; // Custom prop for filename

//                   return !inline && match ? (
//                     <div className="relative my-3">
//                       {filename && (
//                         <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-mono rounded-t-lg border-b border-gray-700">
//                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
//                           <span>{filename}</span>
//                         </div>
//                       )}
//                       <pre
//                         className={`${className} overflow-x-auto text-sm`}
//                         {...props}
//                       >
//                         {children}
//                       </pre>
//                     </div>
//                   ) : (
//                     <code className={className} {...props}>
//                       {children}
//                     </code>
//                   );
//                 },
//               }}
//             >
//               {section.content}
//             </ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageRenderer;

// import React, { useState, useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/atom-one-dark.css';
// import { Check, Copy, ChevronDown, ChevronUp, Zap } from 'lucide-react';

// const MessageRenderer = ({ text }) => {
//   const [copiedSection, setCopiedSection] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({});
//   const contentRef = useRef(null);

//   const splitIntoSections = (content) => {
//     const sections = [];
//     const lines = content.split('\n');
//     let currentSection = { title: 'Main Content', content: '', level: 0 };

//     lines.forEach((line) => {
//       const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
//       if (headingMatch) {
//         if (currentSection.content.trim()) {
//           sections.push({ ...currentSection });
//         }
//         currentSection = {
//           title: headingMatch[2],
//           content: line + '\n',
//           level: headingMatch[1].length,
//         };
//       } else {
//         currentSection.content += line + '\n';
//       }
//     });

//     if (currentSection.content.trim()) {
//       sections.push(currentSection);
//     }

//     return sections.length > 0
//       ? sections
//       : [{ title: 'Response', content, level: 0 }];
//   };

//   const sections = splitIntoSections(text);

//   const copySection = async (sectionId, sectionContent) => {
//     try {
//       await navigator.clipboard.writeText(sectionContent.trim());
//       setCopiedSection(sectionId);
//       setTimeout(() => setCopiedSection(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy text:', err);
//     }
//   };

//   const toggleSection = (sectionIndex) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionIndex]: !prev[sectionIndex],
//     }));
//   };

//   const isSectionExpanded = (sectionIndex) => {
//     return expandedSections[sectionIndex] !== false;
//   };

//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }, [text]);

//   return (
//     <div
//       ref={contentRef}
//       className="message-renderer w-full max-w-full px-0 py-4 mb-4 rounded-lg shadow-lg animate-fade-in"
//     >
//       {/* Main Copy Button for entire message */}
//       <div className="absolute top-3 right-3 z-20">
//         <button
//           onClick={() => copySection('full', text)}
//           className={`
//             flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
//             ${
//               copiedSection === 'full'
//                 ? 'bg-green-600 text-white'
//                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
//             }
//           `}
//           aria-label="Copy entire message"
//         >
//           {copiedSection === 'full' ? (
//             <>
//               <Check size={20} />
//               <span className="hidden sm:inline">Copied!</span>
//             </>
//           ) : (
//             <>
//               <Copy size={18} />
//               <span className="hidden sm:inline">Copy All</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="pt-16 sm:pt-12">
//         <div className="space-y-6">
//           {sections.map((section, index) => (
//             <SectionBlock
//               key={index}
//               section={section}
//               index={index}
//               isExpanded={isSectionExpanded(index)}
//               isCopied={copiedSection === index}
//               onToggle={() => toggleSection(index)}
//               onCopy={() => copySection(index, section.content)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SectionBlock = ({
//   section,
//   index,
//   isExpanded,
//   isCopied,
//   onToggle,
//   onCopy,
// }) => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   return (
//     <div className="section-block w-full rounded-lg overflow-hidden bg-gray-800/50">
//       {/* Section Header */}
//       <div
//         className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-gray-700/60 transition-colors rounded-t-lg"
//         onClick={onToggle}
//         role="button"
//         aria-expanded={isExpanded}
//         aria-controls={`section-content-${index}`}
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             onToggle();
//           }
//         }}
//       >
//         <div className="flex items-center gap-4 flex-1 min-w-0">
//           <div
//             className={`flex-shrink-0 w-3 h-3 rounded-full
//               ${
//                 section.level === 1
//                   ? 'bg-pink-400'
//                   : section.level === 2
//                   ? 'bg-purple-400'
//                   : section.level === 3
//                   ? 'bg-cyan-400'
//                   : 'bg-blue-400'
//               }
//             `}
//           />
//           <h3 className="text-lg sm:text-xl font-bold text-gray-100 truncate">
//             {section.title || `Section ${index + 1}`}
//           </h3>
//         </div>

//         <div className="flex items-center gap-3 flex-shrink-0">
//           {/* Copy Button for Section */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onCopy();
//             }}
//             className={`
//               flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
//               ${
//                 isCopied
//                   ? 'bg-green-600 text-white'
//                   : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
//               }
//             `}
//             aria-label={`Copy section: ${section.title}`}
//           >
//             {isCopied ? <Check size={18} /> : <Copy size={18} />}
//             {!isMobile && (
//               <span className="text-base">{isCopied ? 'Copied!' : 'Copy'}</span>
//             )}
//           </button>

//           {/* Expand/Collapse Toggle */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggle();
//             }}
//             className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
//             aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
//           >
//             {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Section Content */}
//       {isExpanded && (
//         <div
//           id={`section-content-${index}`}
//           className="px-4 sm:px-6 py-5 animate-fade-in-up w-full"
//         >
//           <div
//             className={`
//             message-content prose prose-invert w-full max-w-none
//             prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4
//             prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl
//             prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl
//             prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl
//             prose-h4:text-lg sm:prose-h4:text-xl lg:prose-h4:text-2xl

//             prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
//             prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
//             prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

//             prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-lg
//             sm:prose-p:text-xl sm:prose-p:leading-loose sm:prose-p:mb-5

//             prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base
//             sm:prose-code:text-lg

//             prose-pre:bg-gray-950 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:p-5 prose-pre:overflow-x-auto
//             prose-pre:text-base sm:prose-pre:text-lg

//             prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/60 prose-blockquote:pl-5 prose-blockquote:py-3 prose-blockquote:rounded-r
//             prose-blockquote:text-lg sm:prose-blockquote:text-xl

//             prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-orange-400 prose-ul:space-y-2 prose-ul:text-lg
//             sm:prose-ul:text-xl
//             prose-ol:list-decimal prose-ol:pl-6 prose-ol:marker:text-indigo-400 prose-ol:space-y-2 prose-ol:text-lg
//             sm:prose-ol:text-xl

//             prose-table:w-full prose-table:border-collapse prose-table:text-left prose-table:text-lg
//             sm:prose-table:text-xl
//             prose-th:bg-gray-700 prose-th:text-blue-300 prose-th:font-semibold prose-th:px-5 prose-th:py-3 prose-th:border prose-th:border-gray-600
//             prose-td:px-5 prose-td:py-3 prose-td:border prose-td:border-gray-700 prose-td:text-gray-300

//             prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:underline-offset-4 prose-a:transition-colors prose-a:text-lg
//             sm:prose-a:text-xl
//             prose-hr:border-gray-700 prose-hr:my-8
//           `}
//           >
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]}
//               rehypePlugins={[rehypeHighlight]}
//               components={{
//                 table: ({ children }) => (
//                   <div className="overflow-x-auto rounded-lg my-6 border border-gray-700 shadow-lg bg-gray-800 w-full">
//                     <table className="w-full min-w-full border-collapse text-lg">
//                       {children}
//                     </table>
//                   </div>
//                 ),
//                 code({ node, inline, className, children, ...props }) {
//                   const match = /language-(\w+)/.exec(className || '');
//                   const filename = props.filename || null;

//                   return !inline && match ? (
//                     <div className="relative my-4 w-full">
//                       {filename && (
//                         <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono rounded-t-lg border-b border-gray-700">
//                           <div className="w-2 h-2 bg-red-400 rounded-full"></div>
//                           <span>{filename}</span>
//                         </div>
//                       )}
//                       <pre
//                         className={`${className} overflow-x-auto text-base sm:text-lg w-full`}
//                         {...props}
//                       >
//                         {children}
//                       </pre>
//                     </div>
//                   ) : (
//                     <code className={className} {...props}>
//                       {children}
//                     </code>
//                   );
//                 },
//               }}
//             >
//               {section.content}
//             </ReactMarkdown>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageRenderer;

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
    <div className="relative bg-gray-900/70 p-4 rounded-xl border border-gray-700 shadow-xl backdrop-blur-lg">
      {/* Copy Full Response Button */}
      <button
        onClick={handleCopyAll}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300"
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
                  className="absolute top-2 right-2 p-1 rounded-md bg-gray-600 hover:bg-gray-500 text-xs text-white"
                >
                  {codeCopied ? 'Copied ✅' : <Copy size={14} />}
                </button>
                <pre className="bg-black/80 p-4 rounded-xl overflow-x-auto text-base">
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
