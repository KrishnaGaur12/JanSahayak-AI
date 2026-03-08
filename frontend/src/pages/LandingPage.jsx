import React, { useEffect, useRef } from 'react';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
    const statsRef = useRef(null);

    const handleGetStarted = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onGetStarted === 'function') {
            onGetStarted();
        }
    };

    /* Animate stat counters on scroll into view */
    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.querySelectorAll('.stat-number').forEach((num) => {
                        const target = parseInt(num.dataset.target, 10);
                        const suffix = num.dataset.suffix || '';
                        let current = 0;
                        const step = Math.max(1, Math.floor(target / 60));
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            num.textContent = current.toLocaleString('en-IN') + suffix;
                        }, 18);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing">
            {/* ──── Announcement Bar ──── */}
            <div className="landing-announcement">
                <span className="announcement-sparkle">✦</span>
                <span className="announcement-badge">NEW</span>
                <span className="announcement-text">Now available in Hindi & English — Talk to AI in your language!</span>
                <span className="announcement-arrow">→</span>
                <span className="announcement-sparkle">✦</span>
            </div>

            {/* ──── Navigation ──── */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <span className="nav-brand-text">JanSahayak</span>
                </div>
                <div className="nav-links">
                    <a href="#features" className="nav-link">HOW IT WORKS <span className="nav-chevron">›</span></a>
                    <a href="#services" className="nav-link">SERVICES <span className="nav-chevron">›</span></a>
                    <a href="#schemes" className="nav-link">SCHEMES <span className="nav-chevron">›</span></a>
                </div>
                <div className="nav-actions">
                    <button type="button" className="nav-cta-filled" onClick={handleGetStarted}>
                        Start Talking →
                    </button>
                </div>
            </nav>

            {/* ──── Hero — User-friendly content ──── */}
            <main className="landing-hero">
                {/* Decorative ornament */}
                <div className="hero-ornament" aria-hidden="true">
                    <svg width="220" height="60" viewBox="0 0 220 60" fill="none" className="ornament-svg">
                        <path d="M110 8C88 8 72 22 55 32C38 22 22 13 11 16C5 17 2 22 5 27C9 33 22 30 33 34C22 38 9 36 5 41C2 47 5 51 11 52C22 55 38 46 55 35C72 46 88 54 110 54" stroke="url(#ornGrad)" strokeWidth="1.2" fill="none" opacity="0.5" />
                        <path d="M110 8C132 8 148 22 165 32C182 22 198 13 209 16C215 17 218 22 215 27C211 33 198 30 187 34C198 38 211 36 215 41C218 47 215 51 209 52C198 55 182 46 165 35C148 46 132 54 110 54" stroke="url(#ornGrad)" strokeWidth="1.2" fill="none" opacity="0.5" />
                        <circle cx="110" cy="30" r="4" fill="url(#ornGrad)" opacity="0.6" />
                        <circle cx="55" cy="32" r="2.5" fill="#ff6b2b" opacity="0.3" />
                        <circle cx="165" cy="32" r="2.5" fill="#ff6b2b" opacity="0.3" />
                        <defs>
                            <linearGradient id="ornGrad" x1="0" y1="0" x2="220" y2="60">
                                <stop stopColor="#ff6b2b" />
                                <stop offset="1" stopColor="#ffb347" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Badge */}
                <div className="hero-badge">
                    <span>🇮🇳 Your AI Assistant for Government Services</span>
                </div>

                {/* Headline — clear, user-friendly */}
                <h1 className="hero-title">
                    Ask. Speak. Get Help.
                </h1>

                <p className="hero-subtitle">
                    Just talk to JanSahayak AI — ask about government schemes,<br />
                    file complaints, or find the right service. In Hindi or English.
                </p>

                {/* Single CTA — dark pill */}
                <button type="button" className="hero-cta" onClick={handleGetStarted}>
                    🎤 Start Talking to JanSahayak
                </button>

                <p className="hero-hint">No sign-up needed. Just press and speak.</p>

                {/* Trust section */}
                <div className="hero-trust">
                    <p className="trust-label">WHAT YOU CAN DO</p>
                    <div className="trust-logos">
                        <div className="trust-item"><span className="trust-icon">🏛️</span><span>Find Schemes</span></div>
                        <div className="trust-divider" />
                        <div className="trust-item"><span className="trust-icon">🗣️</span><span>Speak in Hindi</span></div>
                        <div className="trust-divider" />
                        <div className="trust-item"><span className="trust-icon">📝</span><span>File Complaints</span></div>
                        <div className="trust-divider" />
                        <div className="trust-item"><span className="trust-icon">✅</span><span>Get Instant Answers</span></div>
                    </div>
                </div>
            </main>

            {/* ──── Features — How it works ──── */}
            <section className="landing-features" id="features">
                <p className="section-eyebrow">HOW IT WORKS</p>
                <h2 className="section-title">It's as easy as<br /><span className="text-gradient-hero">talking to a friend</span></h2>
                <p className="section-subtitle">No forms. No long queues. Just speak or type — AI does the rest.</p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-step-line" aria-hidden="true" />
                        <div className="feature-number-badge">01</div>
                        <div className="feature-icon-wrap"><span>🎤</span></div>
                        <h3>Press the mic & speak</h3>
                        <p>Say something like <em>"मुझे किसान योजना चाहिए"</em> or <em>"I need health insurance"</em> — speak naturally in Hindi or English.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-step-line" aria-hidden="true" />
                        <div className="feature-number-badge">02</div>
                        <div className="feature-icon-wrap"><span>🧠</span></div>
                        <h3>AI understands you</h3>
                        <p>Our AI instantly figures out what you need — whether it's a government scheme, a civic complaint, or general help.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-number-badge">03</div>
                        <div className="feature-icon-wrap"><span>✅</span></div>
                        <h3>Get your answer</h3>
                        <p>See matching schemes, hear a spoken response, or get your complaint registered — all within seconds.</p>
                    </div>
                </div>
            </section>

            {/* ──── Services Hub ──── */}
            <section className="landing-services" id="services">
                <p className="section-eyebrow">SERVICES</p>
                <h2 className="section-title">One assistant for<br /><span className="text-gradient-hero">all your needs</span></h2>
                <p className="section-subtitle">Ask about any government service — JanSahayak connects you to the right one.</p>

                <div className="services-hub">
                    <svg className="hub-arcs" viewBox="0 0 600 360" fill="none" aria-hidden="true">
                        <path d="M300 310 Q300 180 150 120" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
                        <path d="M300 310 Q300 180 450 120" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
                        <path d="M300 310 Q240 200 80 200" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.3" />
                        <path d="M300 310 Q360 200 520 200" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.3" />
                        <path d="M300 310 Q280 240 180 300" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.25" />
                        <path d="M300 310 Q320 240 420 300" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" opacity="0.25" />
                        <defs>
                            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ff6b2b" />
                                <stop offset="100%" stopColor="#ffb347" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="hub-center"><span>JanSahayak AI</span></div>
                    <div className="hub-node hn-1"><span className="hn-emoji">🏛️</span><span className="hn-label">Schemes</span></div>
                    <div className="hub-node hn-2"><span className="hn-emoji">🏥</span><span className="hn-label">Health</span></div>
                    <div className="hub-node hn-3"><span className="hn-emoji">🏠</span><span className="hn-label">Housing</span></div>
                    <div className="hub-node hn-4"><span className="hn-emoji">📚</span><span className="hn-label">Education</span></div>
                    <div className="hub-node hn-5"><span className="hn-emoji">🌾</span><span className="hn-label">Agriculture</span></div>
                    <div className="hub-node hn-6"><span className="hn-emoji">💼</span><span className="hn-label">Finance</span></div>
                </div>
            </section>

            {/* ──── Schemes Showcase ──── */}
            <section className="landing-schemes" id="schemes">
                <p className="section-eyebrow">POPULAR SCHEMES</p>
                <h2 className="section-title">Find the right scheme<br /><span className="text-gradient-hero">in seconds</span></h2>
                <p className="section-subtitle">Just ask — "मुझे कौन सी योजना मिल सकती है?" and AI finds it for you.</p>

                <div className="schemes-scroll">
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">🌾</span></div>
                        <h4>PM Kisan Samman Nidhi</h4>
                        <p>₹6,000/year for farmers</p>
                        <span className="scheme-tag">Agriculture</span>
                    </div>
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">🏥</span></div>
                        <h4>Ayushman Bharat</h4>
                        <p>₹5 lakh health coverage</p>
                        <span className="scheme-tag">Healthcare</span>
                    </div>
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">🏠</span></div>
                        <h4>PM Awas Yojana</h4>
                        <p>Housing assistance</p>
                        <span className="scheme-tag">Housing</span>
                    </div>
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">🔥</span></div>
                        <h4>Ujjwala Yojana</h4>
                        <p>Free LPG connection</p>
                        <span className="scheme-tag">Energy</span>
                    </div>
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">👧</span></div>
                        <h4>Sukanya Samriddhi</h4>
                        <p>Girl child savings</p>
                        <span className="scheme-tag">Finance</span>
                    </div>
                    <div className="scheme-preview">
                        <div className="sp-icon-wrap"><span className="sp-icon">💼</span></div>
                        <h4>MUDRA Yojana</h4>
                        <p>Business loans up to ₹10L</p>
                        <span className="scheme-tag">Enterprise</span>
                    </div>
                </div>
            </section>

            {/* ──── Stats Ribbon ──── */}
            <section className="landing-stats" ref={statsRef}>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number" data-target="50000" data-suffix="+">0</span>
                        <span className="stat-label">Citizens Helped</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number" data-target="200" data-suffix="+">0</span>
                        <span className="stat-label">Schemes Available</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number" data-target="2" data-suffix="">0</span>
                        <span className="stat-label">Languages</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-number" data-target="28" data-suffix="+">0</span>
                        <span className="stat-label">States Covered</span>
                    </div>
                </div>
            </section>

            {/* ──── Bottom CTA ──── */}
            <section className="landing-bottom-cta">
                <div className="bottom-cta-glow" aria-hidden="true" />
                <h2>Ready to try it?<br /><span className="text-gradient-hero">Just press and speak.</span></h2>
                <p className="bottom-cta-sub">Ask anything about government schemes, services, or complaints. AI is here to help.</p>
                <button type="button" className="hero-cta hero-cta-lg" onClick={handleGetStarted}>
                    🎤 Start Talking Now
                </button>
            </section>

            {/* ──── Footer ──── */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="nav-brand-text">JanSahayak <span className="nav-brand-ai">AI</span></span>
                        <p>Your AI-powered helper for government services.<br />Ask in Hindi or English — get instant answers.</p>
                    </div>
                    <div className="footer-tech">
                        <p className="footer-label">POWERED BY</p>
                        <div className="tech-badges">
                            <span>React</span>
                            <span>AWS Bedrock</span>
                            <span>Amazon Transcribe</span>
                            <span>Amazon Polly</span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Made with ❤️ for India | JanSahayak AI 2026</p>
                </div>
            </footer>
        </div>
    );
}
