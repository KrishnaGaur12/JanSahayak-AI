import React from 'react';
import './SchemeCard.css';

export default function SchemeCard({ scheme, language = 'hi' }) {
    if (!scheme) return null;

    const name = scheme.name?.[language] || scheme.name?.en || 'Government Scheme';
    const description = scheme.description?.[language] || scheme.description?.en || '';
    const benefits = scheme.benefits?.[language] || scheme.benefits?.en || '';
    const eligibility = scheme.eligibility?.[language] || scheme.eligibility?.en || [];
    const amount = scheme.amount || '';
    const portalUrl = scheme.portalUrl || '#';
    const category = scheme.category || 'general';

    const categoryIcons = {
        agriculture: '🌾',
        health: '🏥',
        housing: '🏠',
        welfare: '🔥',
        finance: '💰',
        business: '🏪'
    };

    return (
        <div className="scheme-card glass-card animate-fade-in-up">
            <div className="scheme-card-header">
                <span className="scheme-category-icon">{categoryIcons[category] || '📋'}</span>
                <span className="scheme-category-badge">{category}</span>
            </div>

            <h2 className={`scheme-name ${language === 'hi' ? 'text-hindi' : ''}`}>{name}</h2>

            {amount && (
                <div className="scheme-amount">
                    <span className="amount-label">{language === 'hi' ? 'लाभ राशि' : 'Benefit'}</span>
                    <span className="amount-value text-gradient">{amount}</span>
                </div>
            )}

            <p className={`scheme-description ${language === 'hi' ? 'text-hindi' : ''}`}>{description}</p>

            {benefits && (
                <div className="scheme-benefits">
                    <h4>{language === 'hi' ? '✨ लाभ' : '✨ Benefits'}</h4>
                    <p className={language === 'hi' ? 'text-hindi' : ''}>{benefits}</p>
                </div>
            )}

            {eligibility.length > 0 && (
                <div className="scheme-eligibility">
                    <h4>{language === 'hi' ? '📋 पात्रता' : '📋 Eligibility'}</h4>
                    <ul>
                        {eligibility.map((item, index) => (
                            <li key={index} className={language === 'hi' ? 'text-hindi' : ''}>
                                <span className="eligibility-check">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-apply-btn"
            >
                {language === 'hi' ? '🔗 आवेदन करें' : '🔗 Apply Now'}
            </a>
        </div>
    );
}
