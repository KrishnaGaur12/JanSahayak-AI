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
        tagline: 'बोलिये, हम सुन रहे हैं',
        subtitle: 'Speak your query — we\'re listening',
        errorNoAudio: 'कुछ सुनाई नहीं दिया। कृपया दोबारा बोलें।',
        errorGeneric: 'कुछ गलत हो गया। कृपया दोबारा कोशिश करें।',
        errorServer: 'सर्वर से जुड़ने में समस्या है।',
        listening: '🎤 सुन रहा हूँ...',
        thinking: '🤖 समझ रहा हूँ...',
        footer: '🇮🇳 Empowering citizens with AI'
    },
    en: {
        tagline: 'Speak, we\'re listening',
        subtitle: 'Voice-first AI for government services',
        errorNoAudio: 'Could not hear you. Please try again.',
        errorGeneric: 'Something went wrong. Please try again.',
        errorServer: 'Server connection issue.',
        listening: '🎤 Listening...',
        thinking: '🤖 Processing...',
        footer: '🇮🇳 Empowering citizens with AI'
    }
};

export default function VoiceHome({ language = 'hi', chatHistory, onSchemeResult, onComplaintResult, onStatusLookup, onAddMessage }) {
    const [state, setState] = useState('idle'); // idle | recording | processing
    const [orbState, setOrbState] = useState('idle'); // idle | listening | thinking | speaking
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');

    const { isRecording, browserTranscript, startRecording, stopRecording, error: micError } = useVoiceRecorder();
    const { speak, isPlaying } = usePollyPlayer();
    const transcriptRef = useRef('');
    const isStoppingRef = useRef(false);
    const processTextRef = useRef(null);

    const t = labels[language] || labels.hi;

    // Sync speaking state with orb
    useEffect(() => {
        if (isPlaying) setOrbState('speaking');
        else if (orbState === 'speaking') setOrbState('idle');
    }, [isPlaying]);

    useEffect(() => {
        transcriptRef.current = browserTranscript;
    }, [browserTranscript]);

    // Process text function — stored in ref to avoid circular dependency
    const processText = useCallback(async (text) => {
        setState('processing');
        setOrbState('thinking');
        setTranscript(text);
        setError('');

        // Check tracking ID
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

    // Keep ref current
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
            if (processTextRef.current) {
                await processTextRef.current(text);
            }
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
            // Start recording
            setError('');
            setTranscript('');
            setState('recording');
            setOrbState('listening');
            await startRecording({ onSilence: stopAndProcessRecording, silenceMs: 2500 });
        }
    }, [state, startRecording, stopAndProcessRecording]);

    const handleSuggestion = useCallback((text) => { processText(text); }, [processText]);
    const handleTextSubmit = useCallback((text) => { processText(text); }, [processText]);

    return (
        <div className="voice-home">
            {/* Background effects */}
            <div className="vh-bg-grain" />
            <div className="vh-bg-glow" />
            <div className="vh-bg-glow-secondary" />

            <div className="vh-content">
                {/* Headings */}
                <motion.div
                    className="vh-header"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h1 className="vh-title text-hindi">{t.tagline}</h1>
                    <p className="vh-subtitle">{t.subtitle}</p>
                </motion.div>

                {/* AI Orb */}
                <motion.div
                    className="vh-orb-section"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                >
                    <AiOrb state={orbState} onClick={handleOrbClick} />
                </motion.div>

                {/* Live Transcript */}
                <AnimatePresence mode="wait">
                    {(state === 'recording' || state === 'processing' || transcript) && (
                        <motion.div
                            key={state}
                            className="vh-transcript"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {state === 'recording' && (
                                <p className="transcript-status">{t.listening}</p>
                            )}
                            {state === 'recording' && browserTranscript && (
                                <p className="transcript-text text-hindi">"{browserTranscript}"</p>
                            )}
                            {state === 'processing' && (
                                <p className="transcript-status">{t.thinking}</p>
                            )}
                            {state === 'processing' && transcript && (
                                <p className="transcript-text text-hindi">"{transcript}"</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                    {(error || micError) && (
                        <motion.div
                            className="vh-error"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="error-icon">⚠️</span>
                            <p className={language === 'hi' ? 'text-hindi' : ''}>{error || micError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Input — when idle */}
                <AnimatePresence>
                    {state === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <TextInput
                                onSubmit={handleTextSubmit}
                                placeholder={language === 'hi' ? 'या यहाँ टाइप करें...' : 'Or type your query here...'}
                                disabled={state === 'processing'}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Suggestion Chips — when idle */}
                <AnimatePresence>
                    {state === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <SuggestionChips onSelect={handleSuggestion} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="vh-footer">
                <p>{t.footer}</p>
            </div>
        </div>
    );
}
