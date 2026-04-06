import React, { useState } from 'react';
import { Paperclip, Globe, Briefcase, Mic, Send, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isTyping } = useChat();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper glass">
        <button className="input-action-btn">
          <Paperclip size={20} />
        </button>
        <button className="input-action-btn">
          <Globe size={20} />
        </button>
        <button className="input-action-btn">
          <Briefcase size={20} />
        </button>

        <input
          type="text"
          placeholder="Ask Dabby about your cash runway..."
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />

        <div className="input-actions-right">
          <button className="input-action-btn">
            <Mic size={20} />
          </button>
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
      <p className="input-disclaimer">
        AI responses can be inaccurate. Double check critical financial data.
      </p>

      <style jsx="true">{`
        .chat-input-container {
          position: absolute;
          bottom: 1.5rem;
          left: 0;
          right: 0;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          z-index: 20;
          pointer-events: none;
        }

        .chat-input-wrapper {
          width: 100%;
          max-width: 700px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 1rem;
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.8);
          border-radius: 0.875rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          pointer-events: auto;
        }

        .chat-input {
          flex: 1;
          background: none;
          border: none;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
          padding: 0.5rem 0;
        }

        .chat-input:focus {
          outline: none;
        }

        .input-action-btn {
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .input-action-btn:hover {
          background-color: hsl(var(--foreground) / 0.1);
          color: hsl(var(--foreground));
        }

        .input-action-btn :global(svg) {
          width: 18px;
          height: 18px;
        }

        .input-actions-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .send-btn {
          background-color: hsl(var(--primary));
          color: black;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-btn:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }

        .input-disclaimer {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
