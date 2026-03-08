import React, { useEffect } from 'react';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import './ComplaintConfirmation.css';

export default function ComplaintConfirmation({ data, onBack }) {
    const { speak, isPlaying, stop } = usePollyPlayer();

    // Auto-play voice confirmation on mount
    useEffect(() => {
        if (data?.trackingId) {
            const msg = `आपकी शिकायत सफलतापूर्वक दर्ज की गई है। आपका ट्रैकिंग नंबर है ${data.trackingId}। स्थानीय अधिकारियों को सूचित किया जाएगा।`;
            const timer = setTimeout(() => {
                speak(msg, 'hi');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [data?.trackingId]);

    if (!data) return null;

    return (
        <div className="complaint-confirmation page-enter">
            {/* Back Button */}
            <button className="back-button" onClick={() => { stop(); onBack(); }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-hindi">वापस जाएं</span>
            </button>

            {/* Success Animation */}
            <div className="success-container animate-scale-in">
                <div className="success-circle">
                    <svg className="success-checkmark" viewBox="0 0 52 52" width="64" height="64">
                        <circle className="success-circle-bg" cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path className="success-check" d="M14 27l8 8 16-16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Confirmation Text */}
            <div className="confirmation-content animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="confirmation-title text-hindi">शिकायत दर्ज!</h2>
                <p className="confirmation-subtitle">Complaint Recorded</p>
            </div>

            {/* Tracking ID Card */}
            <div className="tracking-card glass-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="tracking-label text-hindi">ट्रैकिंग नंबर</div>
                <div className="tracking-id">{data.trackingId}</div>
                <div className="tracking-hint text-hindi">इसे सुरक्षित रखें</div>
            </div>

            {/* Details */}
            <div className="complaint-details glass-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="detail-row">
                    <span className="detail-icon">📋</span>
                    <div className="detail-content">
                        <span className="detail-label text-hindi">शिकायत</span>
                        <span className="detail-value text-hindi">{data.originalText || data.complaint?.description}</span>
                    </div>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-row">
                    <span className="detail-icon">📌</span>
                    <div className="detail-content">
                        <span className="detail-label text-hindi">स्थिति</span>
                        <span className="detail-value status-badge">
                            <span className="status-dot"></span>
                            Submitted
                        </span>
                    </div>
                </div>
                <div className="detail-divider"></div>
                <div className="detail-row">
                    <span className="detail-icon">🔔</span>
                    <div className="detail-content">
                        <span className="detail-label text-hindi">सूचना</span>
                        <span className="detail-value text-hindi">स्थानीय अधिकारियों को सूचित किया जाएगा</span>
                    </div>
                </div>
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
