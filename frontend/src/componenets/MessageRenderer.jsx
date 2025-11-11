import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import {
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
} from 'lucide-react';

const MessageRenderer = ({ text }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [tableView, setTableView] = useState('auto'); // 'auto', 'card', 'table'
  const contentRef = useRef(null);

  const splitIntoSections = (content) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { title: 'Main Content', content: '', level: 0 };

    lines.forEach((line) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        currentSection = {
          title: headingMatch[2],
          content: line + '\n',
          level: headingMatch[1].length,
        };
      } else {
        currentSection.content += line + '\n';
      }
    });

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
    return expandedSections[sectionIndex] !== false;
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Check if content has tables
  const hasTables = text.includes('|') && text.includes('-');

  return (
    <div
      ref={contentRef}
      className="message-renderer relative p-4 mb-4 animate-fade-in sm:p-6"
    >
      {/* Header with View Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </div>

        {/* {hasTables && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:block">
              Table view:
            </span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setTableView('auto')}
                className={`p-1 rounded text-xs transition-colors ${
                  tableView === 'auto'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Auto (Cards on mobile)"
              >
                <Smartphone size={14} />
              </button>
              <button
                onClick={() => setTableView('table')}
                className={`p-1 rounded text-xs transition-colors ${
                  tableView === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Always table view"
              >
                <Monitor size={14} />
              </button>
            </div>
          </div>
        )} */}
      </div>

      {/* Main Copy Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => copySection('full', text)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${
              copiedSection === 'full'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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

      {/* Content Area */}
      <div className="pt-2">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <SectionBlock
              key={index}
              section={section}
              index={index}
              isExpanded={isSectionExpanded(index)}
              isCopied={copiedSection === index}
              onToggle={() => toggleSection(index)}
              onCopy={() => copySection(index, section.content)}
              tableView={tableView}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 text-gray-500 text-sm">
        <div>{text.length} characters</div>
        {hasTables && (
          <div className="text-xs text-gray-500 sm:hidden">
            💡 Tables shown as cards on mobile
          </div>
        )}
      </div>
    </div>
  );
};

const SectionBlock = ({
  section,
  index,
  isExpanded,
  isCopied,
  onToggle,
  onCopy,
  tableView,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Custom table renderer for mobile
  const TableRenderer = ({ children }) => {
    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const tableRef = useRef(null);

    useEffect(() => {
      if (tableRef.current) {
        const table = tableRef.current;
        const headers = Array.from(table.querySelectorAll('thead th')).map(
          (th) => th.textContent.trim(),
        );
        const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) =>
          Array.from(tr.querySelectorAll('td')).map((td) =>
            td.textContent.trim(),
          ),
        );

        setTableHeaders(headers);
        setTableRows(rows);
      }
    }, [children]);

    const shouldUseCards =
      tableView === 'auto' ? isMobile : tableView === 'card';

    if (shouldUseCards && tableHeaders.length > 0 && tableRows.length > 0) {
      return (
        <div className="mobile-table-cards space-y-3 my-4">
          {tableRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
            >
              <div className="space-y-2">
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="flex flex-col sm:flex-row">
                    <div className="text-sm font-semibold text-blue-300 mb-1 sm:mb-0 sm:w-1/3 sm:pr-2">
                      {tableHeaders[cellIndex]}
                    </div>
                    <div className="text-gray-200 text-sm sm:w-2/3">{cell}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="table-container overflow-x-auto my-4 rounded-lg border border-gray-700">
        <div className="min-w-full">
          <table
            ref={tableRef}
            className="w-full border-collapse text-sm sm:text-base"
          >
            {children}
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="section-block rounded-lg overflow-hidden">
      {/* Section Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-lg"
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
              flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200
              ${
                isCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
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
        <div className="p-3">
          <div
            className={`
            message-content prose prose-invert max-w-none w-full
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-xl prose-h1:mb-3
            sm:prose-h1:text-2xl sm:prose-h1:mb-4
            prose-h2:text-lg prose-h2:mb-2 prose-h2:mt-3
            sm:prose-h2:text-xl sm:prose-h2:mb-3 sm:prose-h2:mt-4
            prose-h3:text-base prose-h3:mb-2 prose-h3:mt-2
            sm:prose-h3:text-lg sm:prose-h3:mb-2 sm:prose-h3:mt-3
            
            prose-h1:bg-gradient-to-r prose-h1:from-pink-400 prose-h1:via-purple-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent
            prose-h2:bg-gradient-to-r prose-h2:from-purple-400 prose-h2:to-blue-400 prose-h2:bg-clip-text prose-h2:text-transparent
            prose-h3:bg-gradient-to-r prose-h3:from-cyan-400 prose-h3:to-green-400 prose-h3:bg-clip-text prose-h3:text-transparent

            prose-p:text-gray-300 prose-p:leading-6 prose-p:mb-3 prose-p:text-sm
            sm:prose-p:leading-7 sm:prose-p:mb-4 sm:prose-p:text-base
            prose-code:bg-gray-800 prose-code:text-green-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:my-3
            prose-ul:list-disc prose-ul:pl-4 prose-li:marker:text-orange-400 prose-li:mb-1
            prose-ol:list-decimal prose-ol:pl-4 prose-ol:marker:text-indigo-400 prose-ol:mb-1

            /* Enhanced table styles */
            prose-table:w-full
            prose-thead:bg-gray-800
            prose-th:text-blue-300 prose-th:font-bold prose-th:px-3 prose-th:py-3 prose-th:text-left
            prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-gray-700 prose-td:text-gray-300
            prose-tbody tr:hover:bg-gray-800/50

            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
            prose-hr:border-gray-700 prose-hr:my-4
          `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                table: ({ children }) => (
                  <TableRenderer>{children}</TableRenderer>
                ),

                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                    {children}
                  </thead>
                ),

                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-700">{children}</tbody>
                ),

                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const filename = props.filename || null;

                  return !inline && match ? (
                    <div className="relative my-3">
                      {filename && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-mono rounded-t-lg">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          <span>{filename}</span>
                        </div>
                      )}
                      <pre
                        className={`${className} overflow-x-auto text-sm p-3 scrollbar-thin`}
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
