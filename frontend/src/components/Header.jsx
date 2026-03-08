import React from 'react';
import './Header.css';

export default function Header({ onLogoClick, language, onLanguageToggle, onHelpClick }) {
    return (
        <header className="app-header">
            <div className="header-left" onClick={onLogoClick} role="button" tabIndex={0}>
                <div className="logo-mark">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" stroke="url(#hGrad)" strokeWidth="1.5" />
                        <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="url(#hGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="hGrad" x1="0" y1="0" x2="24" y2="24">
                                <stop stopColor="#ff6b2b" />
                                <stop offset="1" stopColor="#ffb347" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="header-titles">
                    <h1 className="header-title">JanSahayak <span className="text-gradient">AI</span></h1>
                    <p className="header-subtitle text-hindi">जनसहायक एआई</p>
                </div>
            </div>

            <div className="header-right">
                {/* Language Toggle */}
                <button
                    className="lang-toggle"
                    onClick={onLanguageToggle}
                    aria-label="Toggle language"
                    title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
                >
                    <span className={`lang-option ${language === 'hi' ? 'lang-active' : ''}`}>हि</span>
                    <span className="lang-divider">/</span>
                    <span className={`lang-option ${language === 'en' ? 'lang-active' : ''}`}>En</span>
                </button>

                {/* Help Button */}
                <button className="help-btn" onClick={onHelpClick} aria-label="Help" title="Help">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M6.5 6.5a2.5 2.5 0 0 1 4.87.83c0 1.67-2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="9" cy="13" r="0.5" fill="currentColor" />
                    </svg>
                </button>

            </div>
        </header>
    );
}
