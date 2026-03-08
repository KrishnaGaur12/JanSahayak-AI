import React from 'react';
import './HelpModal.css';

const helpContent = {
    hi: {
        title: 'कैसे उपयोग करें?',
        steps: [
            { icon: '🎤', text: 'माइक बटन दबाएं और अपना सवाल बोलें' },
            { icon: '⌨️', text: 'या नीचे बॉक्स में टाइप करके भी पूछ सकते हैं' },
            { icon: '🎯', text: 'AI आपकी बात समझकर जवाब देगा' },
            { icon: '🔊', text: 'जवाब आवाज़ में भी सुन सकते हैं' },
        ],
        examples: {
            title: 'ये सवाल पूछकर देखें:',
            items: [
                '🌾 "मैं किसान हूँ, बीज के लिए पैसा चाहिए"',
                '🏥 "आयुष्मान भारत योजना के बारे में बताओ"',
                '🛣️ "सड़क पर गड्ढा है, शिकायत करनी है"',
                '🔥 "गैस कनेक्शन कैसे मिलेगा"',
                '🏠 "घर बनाने के लिए सरकारी मदद"',
            ]
        },
        close: 'बंद करें'
    },
    en: {
        title: 'How to Use?',
        steps: [
            { icon: '🎤', text: 'Press the mic button and speak your query' },
            { icon: '⌨️', text: 'Or type your question in the text box below' },
            { icon: '🎯', text: 'AI will understand and respond' },
            { icon: '🔊', text: 'You can also hear the response spoken aloud' },
        ],
        examples: {
            title: 'Try asking:',
            items: [
                '🌾 "I am a farmer, I need money for seeds"',
                '🏥 "Tell me about Ayushman Bharat scheme"',
                '🛣️ "There is a pothole on the road"',
                '🔥 "How to get a gas connection"',
                '🏠 "Government help for building a house"',
            ]
        },
        close: 'Close'
    }
};

export default function HelpModal({ isOpen, onClose, language = 'hi' }) {
    if (!isOpen) return null;

    const content = helpContent[language] || helpContent.hi;

    return (
        <div className="help-overlay animate-fade-in" onClick={onClose}>
            <div className="help-modal glass-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="help-header">
                    <h2 className={language === 'hi' ? 'text-hindi' : ''}>{content.title}</h2>
                    <button className="help-close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="help-steps">
                    {content.steps.map((step, i) => (
                        <div key={i} className="help-step animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <span className="step-number">{i + 1}</span>
                            <span className="step-icon">{step.icon}</span>
                            <span className={`step-text ${language === 'hi' ? 'text-hindi' : ''}`}>{step.text}</span>
                        </div>
                    ))}
                </div>

                <div className="help-divider"></div>

                <div className="help-examples">
                    <h3 className={language === 'hi' ? 'text-hindi' : ''}>{content.examples.title}</h3>
                    <ul>
                        {content.examples.items.map((item, i) => (
                            <li key={i} className={`animate-fade-in-up ${language === 'hi' ? 'text-hindi' : ''}`}
                                style={{ animationDelay: `${(i + 4) * 0.06}s` }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="help-close-btn" onClick={onClose}>
                    {content.close}
                </button>
            </div>
        </div>
    );
}
