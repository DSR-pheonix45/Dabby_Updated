import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm Dabby, your AI financial co-pilot. How can I help you analyze your business data today?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;

        // 1. Add user message
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // 2. Simulate AI response (Mock Streaming)
        setTimeout(() => {
            const assistantMsgId = (Date.now() + 1).toString();
            const assistantMsg = {
                id: assistantMsgId,
                role: 'assistant',
                content: '',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMsg]);

            const fullResponse = "I've analyzed your current financial position. Your cash runway looks healthy at 14 months, but I noticed a 15% spike in 'SaaS Tools' expenses this month. Would you like me to break down the specific vendors causing this variance?";

            let currentIdx = 0;
            const interval = setInterval(() => {
                if (currentIdx < fullResponse.length) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === assistantMsgId
                            ? { ...msg, content: fullResponse.slice(0, currentIdx + 1) }
                            : msg
                    ));
                    currentIdx++;
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 30);
        }, 1000);
    }, []);

    const clearChat = useCallback(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'assistant',
                content: "Hello! I'm Dabby, your AI financial co-pilot. How can I help you analyze your business data today?",
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    const value = {
        messages,
        sendMessage,
        clearChat,
        isTyping
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
