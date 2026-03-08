import React, { useState } from 'react';
import './TextInput.css';

export default function TextInput({ onSubmit, placeholder, disabled }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e?.preventDefault();
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        onSubmit(trimmed);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form className="text-input-container" onSubmit={handleSubmit}>
            <div className="text-input-wrapper">
                <input
                    type="text"
                    className="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || 'यहाँ टाइप करें...'}
                    disabled={disabled}
                    autoComplete="off"
                    id="text-query-input"
                />
                <button
                    type="submit"
                    className="text-input-send"
                    disabled={!text.trim() || disabled}
                    aria-label="Send"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <p className="text-input-hint">
                या टाइप करके भी पूछ सकते हैं
            </p>
        </form>
    );
}
