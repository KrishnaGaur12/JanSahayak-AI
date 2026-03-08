import React from 'react';
import './ComplaintStatus.css';

const labels = {
    hi: {
        title: 'शिकायत की स्थिति', subtitle: 'Complaint Status', back: 'वापस जाएं', newQuery: 'नया सवाल पूछें',
        trackingLabel: 'ट्रैकिंग नंबर', complaint: 'शिकायत', status: 'स्थिति', reportedOn: 'दर्ज की गई', notFound: 'शिकायत नहीं मिली'
    },
    en: {
        title: 'Complaint Status', subtitle: 'Track your complaint', back: 'Go back', newQuery: 'Ask new query',
        trackingLabel: 'Tracking Number', complaint: 'Complaint', status: 'Status', reportedOn: 'Reported on', notFound: 'Complaint not found'
    }
};

const statusLabels = {
    submitted: { text: 'Submitted', color: 'var(--color-success)' },
    under_review: { text: 'Under Review', color: '#f59e0b' },
    in_progress: { text: 'In Progress', color: '#3b82f6' },
    resolved: { text: 'Resolved', color: 'var(--color-success)' },
    closed: { text: 'Closed', color: 'var(--color-text-muted)' }
};

export default function ComplaintStatus({ data, language = 'hi', onBack }) {
    const t = labels[language] || labels.hi;

    if (!data) {
        return (
            <div className="complaint-status page-enter">
                <button className="back-button" onClick={onBack}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M11 4L5 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t.back}</span>
                </button>
                <div className="status-not-found animate-fade-in-up">
                    <span className="not-found-icon">🔍</span>
                    <h2>{t.notFound}</h2>
                </div>
            </div>
        );
    }

    const statusInfo = statusLabels[data.currentStatus || data.status] || statusLabels.submitted;

    return (
        <div className="complaint-status page-enter">
            <button className="back-button" onClick={onBack}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L5 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t.back}</span>
            </button>

            <div className="status-header animate-fade-in-up">
                <span className="status-icon">📋</span>
                <h2 className={language === 'hi' ? 'text-hindi' : ''}>{t.title}</h2>
                <p className="status-subtitle">{t.subtitle}</p>
            </div>

            <div className="status-card glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="status-row">
                    <span className="status-label">{t.trackingLabel}</span>
                    <span className="status-tracking-id text-mono">{data.trackingId}</span>
                </div>
                <div className="status-divider"></div>
                <div className="status-row">
                    <span className="status-label">{t.complaint}</span>
                    <span className={`status-desc ${language === 'hi' ? 'text-hindi' : ''}`}>{data.description}</span>
                </div>
                <div className="status-divider"></div>
                <div className="status-row">
                    <span className="status-label">{t.status}</span>
                    <span className="status-value" style={{ color: statusInfo.color }}>
                        <span className="status-dot-sm" style={{ background: statusInfo.color }}></span>
                        {statusInfo.text}
                    </span>
                </div>
                {data.reportedAt && (
                    <>
                        <div className="status-divider"></div>
                        <div className="status-row">
                            <span className="status-label">{t.reportedOn}</span>
                            <span className="status-date">{new Date(data.reportedAt).toLocaleDateString('en-IN')}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Status history */}
            {data.statusHistory && data.statusHistory.length > 0 && (
                <div className="status-timeline glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {data.statusHistory.map((entry, i) => (
                        <div key={i} className="timeline-entry">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <span className="timeline-status">{(statusLabels[entry.status] || {}).text || entry.status}</span>
                                <span className="timeline-notes">{entry.notes || ''}</span>
                                <span className="timeline-time">{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="new-query-btn" onClick={onBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                    <path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{t.newQuery}</span>
            </button>
        </div>
    );
}
