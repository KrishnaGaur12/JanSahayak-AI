import React, { useEffect } from 'react';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import SchemeCard from '../components/SchemeCard';
import './SchemeResult.css';

const labels = {
    hi: { title: 'योजना मिली!', subtitle: 'We found a scheme for you', said: 'आपने कहा:', newQuery: 'नया सवाल पूछें', back: 'वापस जाएं', speaking: 'बोल रहे हैं...' },
    en: { title: 'Scheme Found!', subtitle: 'Matching government scheme', said: 'You said:', newQuery: 'Ask new query', back: 'Go back', speaking: 'Speaking...' }
};

export default function SchemeResult({ data, language = 'hi', onBack }) {
    const { speak, isPlaying, stop } = usePollyPlayer();
    const t = labels[language] || labels.hi;

    useEffect(() => {
        if (data?.response) {
            const timer = setTimeout(() => speak(data.response, language), 600);
            return () => clearTimeout(timer);
        }
    }, [data?.response]);

    if (!data) return null;

    return (
        <div className="scheme-result page-enter">
            <button className="back-button" onClick={() => { stop(); onBack(); }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L5 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t.back}</span>
            </button>

            <div className="result-header animate-fade-in-up">
                <div className="result-icon">🎯</div>
                <h2 className={`result-title ${language === 'hi' ? 'text-hindi' : ''}`}>{t.title}</h2>
                <p className="result-subtitle">{t.subtitle}</p>
            </div>

            {data.originalText && (
                <div className="original-query glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <span className="query-label">{t.said}</span>
                    <span className={`query-text ${language === 'hi' ? 'text-hindi' : ''}`}>"{data.originalText}"</span>
                </div>
            )}

            <div className="scheme-result-card" style={{ animationDelay: '0.2s' }}>
                <SchemeCard scheme={data.scheme} language={language} />
            </div>

            {isPlaying && (
                <div className="voice-playing animate-fade-in">
                    <div className="voice-bars"><span></span><span></span><span></span><span></span><span></span></div>
                    <span>{t.speaking}</span>
                </div>
            )}

            <button className="new-query-btn" onClick={() => { stop(); onBack(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                    <path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{t.newQuery}</span>
            </button>
        </div>
    );
}
