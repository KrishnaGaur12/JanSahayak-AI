import React, { useState, useCallback } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { usePollyPlayer } from '../hooks/usePollyPlayer';
import { detectIntent, submitComplaint } from '../services/api';
import MicButton from '../components/MicButton';
import TranscriptDisplay from '../components/TranscriptDisplay';
import SuggestionChips from '../components/SuggestionChips';
import './VoiceHome.css';

export default function VoiceHome({ onSchemeResult, onComplaintResult }) {
    const [state, setState] = useState('idle'); // idle | recording | processing
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');

    const { isRecording, browserTranscript, startRecording, stopRecording, error: micError } = useVoiceRecorder();
    const { speak } = usePollyPlayer();

    /**
     * Handle mic button click — toggle recording
     */
    const handleMicClick = useCallback(async () => {
        if (state === 'recording') {
            // Stop recording and process
            setState('processing');
            try {
                const { transcript: finalTranscript } = await stopRecording();
                const text = finalTranscript || browserTranscript;

                if (!text || text.trim().length === 0) {
                    setError('कुछ सुनाई नहीं दिया। कृपया दोबारा बोलें।');
                    setState('idle');
                    return;
                }

                setTranscript(text);
                await processText(text);
            } catch (err) {
                console.error('Recording stop error:', err);
                setError('कुछ गलत हो गया। कृपया दोबारा कोशिश करें।');
                setState('idle');
            }
        } else {
            // Start recording
            setError('');
            setTranscript('');
            setState('recording');
            await startRecording();
        }
    }, [state, browserTranscript, stopRecording, startRecording]);

    /**
     * Process text (from voice or suggestion chip)
     */
    const processText = useCallback(async (text) => {
        setState('processing');
        setTranscript(text);
        setError('');

        try {
            const result = await detectIntent(text);

            if (result.intent === 'SCHEME_INTENT') {
                // Navigate to scheme result
                onSchemeResult({
                    scheme: result.scheme,
                    response: result.response,
                    originalText: text
                });
            } else if (result.intent === 'CIVIC_INTENT') {
                // Submit complaint and navigate
                const complaintResult = await submitComplaint({
                    description: text,
                    location: 'Not specified'
                });
                onComplaintResult({
                    ...complaintResult,
                    response: result.response,
                    originalText: text
                });
            } else {
                // Unknown intent — speak error and reset
                const msg = result.response || 'क्षमा करें, कृपया दोबारा बताएं।';
                setError(msg);
                speak(msg, 'hi');
                setState('idle');
            }
        } catch (err) {
            console.error('Processing error:', err);
            setError('सर्वर से जुड़ने में समस्या है। कृपया दोबारा कोशिश करें।');
            setState('idle');
        }
    }, [onSchemeResult, onComplaintResult, speak]);

    /**
     * Handle suggestion chip click
     */
    const handleSuggestion = useCallback((text) => {
        processText(text);
    }, [processText]);

    return (
        <div className="voice-home page-enter">
            <div className="voice-home-content">
                {/* Title Section */}
                <div className="voice-home-hero">
                    <div className="hero-icon animate-scale-in">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="22" stroke="url(#heroGrad)" strokeWidth="2.5" opacity="0.5" />
                            <circle cx="24" cy="24" r="14" stroke="url(#heroGrad)" strokeWidth="2" opacity="0.3" />
                            <circle cx="24" cy="24" r="6" fill="url(#heroGrad)" />
                            <defs>
                                <linearGradient id="heroGrad" x1="0" y1="0" x2="48" y2="48">
                                    <stop stopColor="#ff6b2b" />
                                    <stop offset="1" stopColor="#ffb347" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="hero-tagline text-hindi animate-fade-in-up">
                        बोलिये, हम सुन रहे हैं
                    </h2>
                    <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Speak your query — we're listening
                    </p>
                </div>

                {/* Mic Button */}
                <div className="voice-home-mic">
                    <MicButton
                        state={state}
                        onClick={handleMicClick}
                    />
                    <p className="mic-hint">
                        {state === 'idle' && '🎤 माइक दबाएं और बोलें'}
                        {state === 'recording' && '🔴 बोलना जारी रखें...'}
                        {state === 'processing' && '⏳ समझ रहे हैं...'}
                    </p>
                </div>

                {/* Transcript Display */}
                <TranscriptDisplay
                    text={state === 'recording' ? browserTranscript : transcript}
                    state={state}
                />

                {/* Error Display */}
                {(error || micError) && (
                    <div className="voice-error animate-fade-in">
                        <span className="error-icon">⚠️</span>
                        <p className="text-hindi">{error || micError}</p>
                    </div>
                )}

                {/* Suggestion Chips — only visible when idle */}
                {state === 'idle' && (
                    <SuggestionChips onSelect={handleSuggestion} />
                )}
            </div>

            {/* Bottom ornament */}
            <div className="voice-home-footer">
                <p className="footer-text">
                    🇮🇳 Empowering citizens with AI
                </p>
            </div>
        </div>
    );
}
