import React from 'react';

// Clean Markdown-like symbols (*, **, _, __)
const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1');
};

const parseToBlocks = (text) => {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentList = null;

  const pushList = () => {
    if (!currentList) return;
    blocks.push(currentList);
    currentList = null;
  };

  for (let raw of lines) {
    const line = cleanText(raw.trim());
    if (line === '') {
      pushList();
      continue;
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      pushList();
      const level = hMatch[1].length;
      blocks.push({ type: 'heading', level, text: hMatch[2] });
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList) currentList = { type: 'ul', items: [] };
      if (currentList.type !== 'ul') {
        pushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList) currentList = { type: 'ol', items: [] };
      if (currentList.type !== 'ol') {
        pushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Paragraph
    pushList();
    blocks.push({ type: 'p', text: line });
  }

  pushList();
  return blocks;
};

const headingColorByLevel = {
  1: 'text-emerald-400',
  2: 'text-sky-400',
  3: 'text-amber-300',
  4: 'text-indigo-300',
  5: 'text-pink-300',
  6: 'text-lime-300',
};

const MessageRenderer = ({ text }) => {
  const blocks = parseToBlocks(text);

  return (
    <div className="prose prose-invert max-w-full break-words">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          const baseClass =
            b.level === 1
              ? 'text-2xl md:text-3xl font-extrabold leading-relaxed mb-6'
              : b.level === 2
              ? 'text-xl md:text-2xl font-bold leading-relaxed mb-5'
              : 'text-lg md:text-xl font-semibold leading-relaxed mb-4';
          const color = headingColorByLevel[b.level] || 'text-white';
          return (
            <div key={i} className={`${baseClass} ${color}`}>
              {b.text}
            </div>
          );
        }

        if (b.type === 'ul' || b.type === 'ol') {
          return (
            <div
              key={i}
              className="mb-5 pl-6 text-lg leading-loose text-gray-200"
            >
              {b.type === 'ul' ? (
                <ul className="list-disc space-y-3">
                  {b.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              ) : (
                <ol className="list-decimal space-y-3">
                  {b.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ol>
              )}
            </div>
          );
        }

        return (
          <p key={i} className="mb-5 text-lg text-gray-200 leading-loose">
            {b.text}
          </p>
        );
      })}
    </div>
  );
};

export default MessageRenderer;
