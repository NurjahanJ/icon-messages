import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
// InlineMath and BlockMath are imported by rehypeKatex
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Only use special styling for errors, otherwise keep original styling
  const bubbleClass = message.role === 'user' 
    ? 'bg-blue-600 text-white self-end' 
    : message.isError 
      ? 'bg-red-100 text-red-800 self-start border border-red-300' 
      : 'bg-gray-100 text-gray-800 self-start';

  return (
    <div className={`flex w-full my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
        ${bubbleClass}
        dark:${isUser
          ? 'bg-gray-700 text-gray-200'
          : 'bg-[#1E1E1E] text-gray-100'
        }`}
      >
        {/* Message Content or Typing Animation */}
        {message.isLoading ? (
          <div className="flex space-x-1 mt-1">
            <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
          </div>
        ) : (
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
              h1: ({ children }) => <p className="font-bold">{children}</p>,
              h2: ({ children }) => <p className="font-bold">{children}</p>,
              h3: ({ children }) => <p className="font-bold">{children}</p>,
              h4: ({ children }) => <p className="font-bold">{children}</p>,
              h5: ({ children }) => <p className="font-bold">{children}</p>,
              h6: ({ children }) => <p className="font-bold">{children}</p>
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        <div className={`text-[11px] mt-2 text-right ${
          isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
