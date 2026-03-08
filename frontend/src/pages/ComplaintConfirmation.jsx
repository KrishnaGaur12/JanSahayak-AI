import React, { useEffect } from 'react';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import './ComplaintConfirmation.css';

const labels = {
    hi: {
        title: 'शिकायत दर्ज!', subtitle: 'Complaint Recorded',
        trackingLabel: 'ट्रैकिंग नंबर', trackingHint: 'इसे सुरक्षित रखें',
        complaint: 'शिकायत', status: 'स्थिति', notification: 'सूचना',
        notified: 'स्थानीय अधिकारियों को सूचित किया जाएगा',
        back: 'वापस जाएं', newQuery: 'नया सवाल पूछें', speaking: 'बोल रहे हैं...'
    },
    en: {
        title: 'Complaint Recorded!', subtitle: 'Your complaint has been registered',
        trackingLabel: 'Tracking Number', trackingHint: 'Save this for reference',
        complaint: 'Complaint', status: 'Status', notification: 'Notification',
        notified: 'Local authorities will be notified',
        back: 'Go back', newQuery: 'Ask new query', speaking: 'Speaking...'
    }
};

export default function ComplaintConfirmation({ data, language = 'hi', onBack }) {
    const { speak, isPlaying, stop } = usePollyPlayer();
    const t = labels[language] || labels.hi;

    useEffect(() => {
        if (data?.trackingId) {
            const msg = language === 'hi'
                ? `आपकी शिकायत दर्ज की गई है। ट्रैकिंग नंबर ${data.trackingId}। स्थानीय अधिकारियों को सूचित किया जाएगा।`
                : `Your complaint has been registered. Tracking number ${data.trackingId}. Local authorities will be notified.`;
            const timer = setTimeout(() => speak(msg, language), 800);
            return () => clearTimeout(timer);
        }
    }, [data?.trackingId]);

    if (!data) return null;

    return (
        <div className="complaint-confirmation page-enter">
            <button className="back-button" onClick={() => { stop(); onBack(); }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L5 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t.back}</span>
            </button>

            {/* Success Icon */}
            <div className="success-container animate-scale-in">
                <div className="success-circle">
                    <svg className="success-checkmark" viewBox="0 0 52 52" width="56" height="56">
                        <circle className="success-circle-bg" cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path className="success-check" d="M14 27l8 8 16-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            <div className="confirmation-content animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <h2 className={language === 'hi' ? 'text-hindi' : ''}>{t.title}</h2>
                <p className="confirmation-subtitle">{t.subtitle}</p>
            </div>

            {/* Tracking Card */}
            <div className="tracking-card glass-card animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <div className="tracking-label">{t.trackingLabel}</div>
                <div className="tracking-id text-mono">{data.trackingId}</div>
                <div className="tracking-hint">{t.trackingHint}</div>
            </div>

            {/* Details */}
            <div className="complaint-details glass-card animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                <div className="detail-row">
                    <span className="detail-icon">📋</span>
                    <div className="detail-content">
                        <span className="detail-label">{t.complaint}</span>
                        <span className={`detail-value ${language === 'hi' ? 'text-hindi' : ''}`}>{data.originalText || data.complaint?.description}</span>
                    </div>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-row">
                    <span className="detail-icon">📌</span>
                    <div className="detail-content">
                        <span className="detail-label">{t.status}</span>
                        <span className="detail-value status-badge"><span className="status-dot"></span>Submitted</span>
                    </div>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-row">
                    <span className="detail-icon">🔔</span>
                    <div className="detail-content">
                        <span className="detail-label">{t.notification}</span>
                        <span className={`detail-value ${language === 'hi' ? 'text-hindi' : ''}`}>{t.notified}</span>
                    </div>
                </div>
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
