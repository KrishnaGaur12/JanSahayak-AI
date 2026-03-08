import React from 'react';
import './MicButton.css';

/**
 * Animated microphone button with 3 states:
 * - idle: gentle pulse
 * - recording: active ripple + red glow
 * - processing: spinning loader
 */
export default function MicButton({ state = 'idle', onClick, disabled }) {
    return (
        <div className={`mic-button-container mic-${state}`}>
            {/* Ripple rings for recording state */}
            {state === 'recording' && (
                <>
                    <div className="mic-ripple mic-ripple-1"></div>
                    <div className="mic-ripple mic-ripple-2"></div>
                    <div className="mic-ripple mic-ripple-3"></div>
                </>
            )}

            <button
                className={`mic-button mic-button-${state}`}
                onClick={onClick}
                disabled={disabled || state === 'processing'}
                aria-label={
                    state === 'idle' ? 'Start recording' :
                        state === 'recording' ? 'Stop recording' :
                            'Processing audio'
                }
            >
                {state === 'processing' ? (
                    <div className="mic-spinner">
                        <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="20 40" strokeLinecap="round" />
                        </svg>
                    </div>
                ) : (
                    <svg className="mic-icon" viewBox="0 0 24 24" fill="none" width="36" height="36">
                        <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                        <path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                )}
            </button>
        </div>
    );
}
