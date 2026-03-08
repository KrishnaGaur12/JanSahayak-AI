import React from 'react';
import './TranscriptDisplay.css';

export default function TranscriptDisplay({ text, state = 'idle' }) {
    if (!text && state === 'idle') return null;

    return (
        <div className={`transcript-display animate-fade-in ${state === 'recording' ? 'transcript-live' : ''}`}>
            {state === 'recording' && (
                <div className="transcript-label">
                    <span className="recording-dot"></span>
                    <span className="text-hindi">सुन रहे हैं...</span>
                </div>
            )}
            {state === 'processing' && (
                <div className="transcript-label">
                    <span className="processing-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                    <span className="text-hindi">समझ रहे हैं</span>
                </div>
            )}
            {text && (
                <p className="transcript-text text-hindi">
                    "{text}"
                </p>
            )}
        </div>
    );
}
