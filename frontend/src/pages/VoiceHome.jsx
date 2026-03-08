import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import { detectIntent, submitComplaint } from '../services/api';
import AiOrb from '../components/AiOrb';
import TextInput from '../components/TextInput';
import SuggestionChips from '../components/SuggestionChips';
import './VoiceHome.css';

const labels = {
    hi: {
        welcome: 'नमस्ते! 🙏',
        welcomeSub: 'आपकी क्या मदद करूँ?',
        chooseAction: 'क्या करना चाहते हैं?',
        schemesTitle: 'सरकारी योजनाएँ खोजें',
        schemesDesc: 'आपके लिए कौन सी योजना है? पूछें',
        complaintsTitle: 'शिकायत दर्ज करें',
        complaintsDesc: 'सड़क, बिजली, पानी — कोई भी शिकायत',
        tagline: 'बोलिये, हम सुन रहे हैं',
        subtitle: 'अपनी बात बोलें — हम सुन रहे हैं',
        errorNoAudio: 'कुछ सुनाई नहीं दिया। कृपया दोबारा बोलें।',
        errorGeneric: 'कुछ गलत हो गया। कृपया दोबारा कोशिश करें।',
        errorServer: 'सर्वर से जुड़ने में समस्या है।',
        listening: '🎤 सुन रहा हूँ...',
        thinking: '🤖 समझ रहा हूँ...',
        footer: '🇮🇳 नागरिकों की सेवा में AI',
        langLabel: 'भाषा चुनें',
        backToOptions: '← वापस विकल्पों पर जाएं',
        goBack: '← वापस जाएं'
    },
    en: {
        welcome: 'Hello! 👋',
        welcomeSub: 'How can I help you today?',
        chooseAction: 'What would you like to do?',
        schemesTitle: 'Find Government Schemes',
        schemesDesc: 'Ask about schemes you\'re eligible for',
        complaintsTitle: 'File a Complaint',
        complaintsDesc: 'Road, electricity, water — any civic issue',
        tagline: 'Speak, we\'re listening',
        subtitle: 'Say your query — we\'re here to help',
        errorNoAudio: 'Could not hear you. Please try again.',
        errorGeneric: 'Something went wrong. Please try again.',
        errorServer: 'Server connection issue.',
        listening: '🎤 Listening...',
        thinking: '🤖 Processing...',
        footer: '🇮🇳 Empowering citizens with AI',
        langLabel: 'Choose language',
        backToOptions: '← Back to options',
        goBack: '← Go back'
    }
};

const schemeSuggestions = [
    { text: 'सरकारी योजना बताओ', textEn: 'Tell me about schemes', icon: '📋' },
    { text: 'किसान योजना', textEn: 'Farmer scheme', icon: '🌾' },
    { text: 'आयुष्मान भारत', textEn: 'Ayushman Bharat', icon: '🏥' },
    { text: 'गैस कनेक्शन', textEn: 'Gas connection', icon: '🔥' },
];

const complaintSuggestions = [
    { text: 'सड़क की शिकायत', textEn: 'Road complaint', icon: '🛣️' },
    { text: 'बिजली की समस्या', textEn: 'Electricity issue', icon: '⚡' },
    { text: 'पानी की समस्या', textEn: 'Water problem', icon: '💧' },
    { text: 'कूड़ा नहीं उठाया', textEn: 'Garbage not collected', icon: '🗑️' },
];

export default function VoiceHome({ language = 'hi', onSetLanguage, chatHistory, onSchemeResult, onComplaintResult, onStatusLookup, onAddMessage, onGoToLanding }) {
    const [view, setView] = useState('choose'); // 'choose' | 'schemes' | 'complaints'
    const [state, setState] = useState('idle'); // idle | recording | processing
    const [orbState, setOrbState] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');

    const { isRecording, browserTranscript, startRecording, stopRecording, error: micError } = useVoiceRecorder();
    const { speak, isPlaying } = usePollyPlayer();
    const transcriptRef = useRef('');
    const isStoppingRef = useRef(false);
    const processTextRef = useRef(null);

    const t = labels[language] || labels.hi;

    useEffect(() => {
        if (isPlaying) setOrbState('speaking');
        else if (orbState === 'speaking') setOrbState('idle');
    }, [isPlaying]);

    useEffect(() => {
        transcriptRef.current = browserTranscript;
    }, [browserTranscript]);

    const processText = useCallback(async (text) => {
        setState('processing');
        setOrbState('thinking');
        setTranscript(text);
        setError('');

        if (/^JS-\d{8}-\d{5}$/i.test(text.trim())) {
            try {
                const response = await fetch(`http://localhost:3001/api/complaint/${text.trim()}`);
                if (response.ok) {
                    const data = await response.json();
                    onStatusLookup(data);
                    return;
                }
            } catch (e) { /* fall through */ }
        }

        try {
            const result = await detectIntent(text);
            if (result.intent === 'SCHEME_INTENT') {
                onSchemeResult({ scheme: result.scheme, response: result.response, originalText: text });
            } else if (result.intent === 'CIVIC_INTENT') {
                const complaintResult = await submitComplaint({ description: text, location: 'Not specified' });
                onComplaintResult({ ...complaintResult, response: result.response, originalText: text });
            } else {
                const msg = result.response || (language === 'hi'
                    ? 'क्षमा करें, कृपया दोबारा बताएं।'
                    : 'Sorry, please try again.');
                setError(msg);
                onAddMessage?.({ role: 'user', text });
                onAddMessage?.({ role: 'system', text: msg });
                speak(msg, language);
                setState('idle');
                setOrbState('idle');
            }
        } catch (err) {
            setError(t.errorServer);
            setState('idle');
            setOrbState('idle');
        }
    }, [language, t, onSchemeResult, onComplaintResult, onStatusLookup, onAddMessage, speak]);

    useEffect(() => {
        processTextRef.current = processText;
    }, [processText]);

    const stopAndProcessRecording = useCallback(async () => {
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;
        setState('processing');
        setOrbState('thinking');
        try {
            const { transcript: finalTranscript } = await stopRecording();
            const text = (finalTranscript || transcriptRef.current || '').trim();
            if (!text) {
                setError(t.errorNoAudio);
                setState('idle');
                setOrbState('idle');
                return;
            }
            setTranscript(text);
            if (processTextRef.current) await processTextRef.current(text);
        } catch (err) {
            setError(t.errorGeneric);
            setState('idle');
            setOrbState('idle');
        } finally {
            isStoppingRef.current = false;
        }
    }, [stopRecording, t.errorNoAudio, t.errorGeneric]);

    const handleOrbClick = useCallback(async () => {
        if (state === 'recording') {
            await stopAndProcessRecording();
        } else if (state === 'idle') {
            setError('');
            setTranscript('');
            setState('recording');
            setOrbState('listening');
            await startRecording({ onSilence: stopAndProcessRecording, silenceMs: 2500 });
        }
    }, [state, startRecording, stopAndProcessRecording]);

    const handleSuggestion = useCallback((text) => { processText(text); }, [processText]);
    const handleTextSubmit = useCallback((text) => { processText(text); }, [processText]);

    const currentSuggestions = view === 'schemes' ? schemeSuggestions : complaintSuggestions;

    return (
        <div className="voice-home">
            <div className="vh-bg-grain" />
            <div className="vh-bg-glow" />
            <div className="vh-bg-glow-secondary" />

            <div className="vh-content">
                {/* ===== Language Toggle — always visible ===== */}
                <motion.div
                    className="vh-lang-toggle"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <span className="vh-lang-label">{t.langLabel}</span>
                    <div className="vh-lang-buttons">
                        <button
                            className={`vh-lang-btn ${language === 'hi' ? 'vh-lang-active' : ''}`}
                            onClick={() => onSetLanguage('hi')}
                        >
                            हिंदी
                        </button>
                        <button
                            className={`vh-lang-btn ${language === 'en' ? 'vh-lang-active' : ''}`}
                            onClick={() => onSetLanguage('en')}
                        >
                            English
                        </button>
                    </div>
                </motion.div>

                {/* ===== Choose Action View ===== */}
                <AnimatePresence mode="wait">
                    {view === 'choose' && (
                        <motion.div
                            key="choose"
                            className="vh-choose-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="vh-welcome text-hindi">{t.welcome}</h1>
                            <p className="vh-welcome-sub">{t.welcomeSub}</p>
                            <p className="vh-choose-label">{t.chooseAction}</p>

                            <div className="vh-action-cards">
                                <button className="vh-action-card" onClick={() => setView('schemes')}>
                                    <span className="vh-action-icon">🏛️</span>
                                    <span className="vh-action-title">{t.schemesTitle}</span>
                                    <span className="vh-action-desc">{t.schemesDesc}</span>
                                    <span className="vh-action-arrow">→</span>
                                </button>
                                <button className="vh-action-card" onClick={() => setView('complaints')}>
                                    <span className="vh-action-icon">📋</span>
                                    <span className="vh-action-title">{t.complaintsTitle}</span>
                                    <span className="vh-action-desc">{t.complaintsDesc}</span>
                                    <span className="vh-action-arrow">→</span>
                                </button>
                            </div>

                            {/* Back to landing */}
                            <button className="vh-back-link" onClick={onGoToLanding}>
                                {t.goBack}
                            </button>
                        </motion.div>
                    )}

                    {/* ===== Voice Query View (Schemes or Complaints) ===== */}
                    {(view === 'schemes' || view === 'complaints') && (
                        <motion.div
                            key="voice"
                            className="vh-voice-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Back to choose */}
                            <button className="vh-back-link" onClick={() => { setView('choose'); setState('idle'); setOrbState('idle'); setError(''); setTranscript(''); }}>
                                {t.backToOptions}
                            </button>

                            <motion.div
                                className="vh-header"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h1 className="vh-title text-hindi">{t.tagline}</h1>
                                <p className="vh-subtitle">{t.subtitle}</p>
                            </motion.div>

                            <motion.div
                                className="vh-orb-section"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.25 }}
                            >
                                <AiOrb state={orbState} onClick={handleOrbClick} />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {(state === 'recording' || state === 'processing' || transcript) && (
                                    <motion.div key={state} className="vh-transcript" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                                        {state === 'recording' && <p className="transcript-status">{t.listening}</p>}
                                        {state === 'recording' && browserTranscript && <p className="transcript-text text-hindi">"{browserTranscript}"</p>}
                                        {state === 'processing' && <p className="transcript-status">{t.thinking}</p>}
                                        {state === 'processing' && transcript && <p className="transcript-text text-hindi">"{transcript}"</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {(error || micError) && (
                                    <motion.div className="vh-error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                        <span className="error-icon">⚠️</span>
                                        <p className={language === 'hi' ? 'text-hindi' : ''}>{error || micError}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {state === 'idle' && (
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                        <TextInput
                                            onSubmit={handleTextSubmit}
                                            placeholder={language === 'hi' ? 'या यहाँ टाइप करें...' : 'Or type your query here...'}
                                            disabled={state === 'processing'}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {state === 'idle' && (
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, delay: 0.2 }}>
                                        <SuggestionChips onSelect={handleSuggestion} suggestions={currentSuggestions} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="vh-footer">
                <p>{t.footer}</p>
            </div>
        </div>
    );
}
