import React, { useRef, useEffect } from 'react';
import './ChatHistory.css';

export default function ChatHistory({ messages, language = 'hi' }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages || messages.length === 0) return null;

    return (
        <div className="chat-history">
            <div className="chat-label">
                {language === 'hi' ? 'बातचीत' : 'Conversation'}
            </div>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`chat-bubble chat-${msg.role} animate-fade-in-up`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        <div className="bubble-icon">
                            {msg.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className={`bubble-content ${language === 'hi' ? 'text-hindi' : ''}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
