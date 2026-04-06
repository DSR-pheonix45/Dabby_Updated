import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const ChatHistory = () => {
    const { messages, isTyping } = useChat();
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="chat-history">
            {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.role}`}>
                    {msg.role === 'assistant' && (
                        <div className="assistant-avatar">
                            <svg viewBox="0 0 100 80" width="24" height="24">
                                <path d="M50 0C25 0 0 20 0 45C0 70 20 80 50 80C80 80 100 70 100 45C100 20 75 0 50 0Z" fill="hsl(var(--primary))" />
                                <ellipse cx="35" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                                <ellipse cx="65" cy="45" rx="6" ry="10" fill="hsl(var(--background))" />
                            </svg>
                        </div>
                    )}
                    <div className={`message-bubble ${msg.role === 'assistant' ? 'glass' : 'user'}`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />

            <style jsx="true">{`
        .chat-history {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem 0;
        }

        /* Custom Scrollbar */
        .chat-history::-webkit-scrollbar {
          width: 4px;
        }

        .chat-history::-webkit-scrollbar-thumb {
          background-color: hsl(var(--primary) / 0.1);
          border-radius: 4px;
        }

        .message-row {
          display: flex;
          gap: 0.875rem;
          max-width: 85%;
          width: auto;
        }

        .message-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
          max-width: 80%;
        }

        .assistant-avatar {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
          padding-top: 0.4rem;
        }

        .message-bubble {
          padding: 0.75rem 1.125rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          line-height: 1.55;
          white-space: pre-wrap;
          box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.2);
        }

        .message-row.assistant .message-bubble {
          border-top-left-radius: 4px;
          background-color: hsl(var(--card) / 0.95);
          border: 1px solid hsl(var(--border) / 0.5);
          color: hsl(var(--foreground));
        }

        .message-row.user .message-bubble {
          border-top-right-radius: 4px;
          background-color: hsl(var(--primary) / 0.15);
          border: 1px solid hsl(var(--primary) / 0.3);
          color: hsl(var(--foreground));
        }
      `}</style>
        </div>
    );
};

export default ChatHistory;
