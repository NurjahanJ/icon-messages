import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatHistory = ({ messages, messagesEndRef }) => {
  const historyRef = useRef(null);

  useEffect(() => {
    if (historyRef.current?.parentElement) {
      historyRef.current.parentElement.style.overflowY = 'auto';
    }
  }, [messages]);

  return (
    <div className="w-full max-w-[850px] mx-auto px-4" ref={historyRef}>
      <div className="py-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatHistory;
