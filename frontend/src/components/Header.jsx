import React from 'react';
import './Header.css';

export default function Header({ onLogoClick }) {
    return (
        <header className="app-header">
            <div className="header-content" onClick={onLogoClick} role="button" tabIndex={0}>
                <div className="header-logo">
                    <div className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="13" stroke="url(#grad)" strokeWidth="2" />
                            <path d="M9 14.5L12.5 18L19 10" stroke="url(#grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28">
                                    <stop stopColor="#ff6b2b" />
                                    <stop offset="1" stopColor="#ffb347" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="header-text">
                        <h1 className="header-title">JanSahayak <span className="text-gradient">AI</span></h1>
                        <p className="header-subtitle text-hindi">जनसहायक एआई</p>
                    </div>
                </div>
            </div>
            <div className="header-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">MVP</span>
            </div>
        </header>
    );
}
