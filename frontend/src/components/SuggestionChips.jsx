import React from 'react';
import './SuggestionChips.css';

const defaultSuggestions = [
    { text: 'सरकारी योजना बताओ', textEn: 'Tell me about schemes', icon: '📋' },
    { text: 'किसान योजना', textEn: 'Farmer scheme', icon: '🌾' },
    { text: 'आयुष्मान भारत', textEn: 'Ayushman Bharat', icon: '🏥' },
    { text: 'सड़क की शिकायत', textEn: 'Road complaint', icon: '🛣️' },
    { text: 'गैस कनेक्शन', textEn: 'Gas connection', icon: '🔥' },
    { text: 'बिजली की समस्या', textEn: 'Electricity issue', icon: '⚡' },
];

export default function SuggestionChips({ onSelect, suggestions = defaultSuggestions }) {
    return (
        <div className="suggestion-chips">
            <p className="chips-label text-hindi">या यहाँ से चुनें:</p>
            <div className="chips-container">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="chip animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.08}s` }}
                        onClick={() => onSelect(suggestion.text)}
                    >
                        <span className="chip-icon">{suggestion.icon}</span>
                        <span className="chip-text text-hindi">{suggestion.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
