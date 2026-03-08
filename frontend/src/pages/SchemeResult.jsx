import React, { useEffect } from 'react';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import SchemeCard from '../components/SchemeCard';
import './SchemeResult.css';

export default function SchemeResult({ data, onBack }) {
    const { speak, isPlaying, stop } = usePollyPlayer();

    // Auto-play voice response on mount
    useEffect(() => {
        if (data?.response) {
            const timer = setTimeout(() => {
                speak(data.response, 'hi');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [data?.response]);

    if (!data) return null;

    return (
        <div className="scheme-result page-enter">
            {/* Back Button */}
            <button className="back-button" onClick={() => { stop(); onBack(); }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-hindi">वापस जाएं</span>
            </button>

            {/* Result Header */}
            <div className="result-header animate-fade-in-up">
                <div className="result-icon">🎯</div>
                <h2 className="result-title text-hindi">योजना मिली!</h2>
                <p className="result-subtitle">We found a scheme for you</p>
            </div>

            {/* Original Query */}
            {data.originalText && (
                <div className="original-query animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <span className="query-label">आपने कहा:</span>
                    <span className="query-text text-hindi">"{data.originalText}"</span>
                </div>
            )}

            {/* Scheme Card */}
            <div className="scheme-result-card" style={{ animationDelay: '0.2s' }}>
                <SchemeCard scheme={data.scheme} language="hi" />
            </div>

            {/* Voice Playback Indicator */}
            {isPlaying && (
                <div className="voice-playing animate-fade-in">
                    <div className="voice-bars">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <span className="text-hindi">बोल रहे हैं...</span>
                </div>
            )}

            {/* New Query Button */}
            <button className="new-query-btn" onClick={() => { stop(); onBack(); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                    <path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-hindi">नया सवाल पूछें</span>
            </button>
        </div>
    );
}
