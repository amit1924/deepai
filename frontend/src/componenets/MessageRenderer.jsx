import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Copy, Check } from "lucide-react";

/* ---------------- CODE BLOCK ---------------- */
const CodeBlock = ({ inline, className, children, node }) => {
  const [copied, setCopied] = useState(false);

  // ✅ Fix [object Object] issue
  const code =
    typeof children === "string"
      ? children
      : node?.children?.map((child) => child.value || "").join("") || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (inline) {
    return (
      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-yellow-300 text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-4">
      {/* ✅ ALWAYS VISIBLE COPY BUTTON */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-md text-white shadow-md"
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <Check size={14} /> Copied
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Copy size={14} /> Copy
          </span>
        )}
      </button>

      <pre className="overflow-x-auto rounded-xl bg-[#0d1117] p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const MessageRenderer = ({ text }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl shadow-xl">

      {/* ✅ COPY FULL RESPONSE */}
      <button
        onClick={handleCopyAll}
        className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-md text-white"
      >
        {copiedAll ? (
          <>
            <Check size={14} /> Copied
          </>
        ) : (
          <>
            <Copy size={14} /> Copy All
          </>
        )}
      </button>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: (props) => (
            <h1 className="text-3xl font-bold text-pink-400 mb-4" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-xl font-medium text-yellow-400 mb-2" {...props} />
          ),
          p: (props) => (
            <p className="text-gray-200 leading-relaxed mb-3" {...props} />
          ),

          strong: (props) => (
            <strong className="text-green-300 font-semibold" {...props} />
          ),

          em: (props) => (
            <em className="text-blue-300 italic" {...props} />
          ),

          ul: (props) => (
            <ul className="list-disc ml-6 space-y-2 text-gray-300" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal ml-6 space-y-2 text-gray-300" {...props} />
          ),

          a: (props) => (
            <a
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          /* ---------------- TABLE FIX ---------------- */
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700 text-sm">
                {children}
              </table>
            </div>
          ),

          th: (props) => (
            <th
              className="bg-gray-700 text-cyan-300 px-4 py-2 border border-gray-600 whitespace-nowrap"
              {...props}
            />
          ),

          td: (props) => (
            <td
              className="px-4 py-2 border border-gray-700 text-gray-200 whitespace-nowrap"
              {...props}
            />
          ),

          /* ---------------- CODE ---------------- */
          code: CodeBlock,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;