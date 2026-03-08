import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AiOrb.css';

/**
 * AI Orb states: idle | listening | thinking | speaking
 */
export default function AiOrb({ state = 'idle', onClick }) {
    const isListening = state === 'listening';
    const isThinking = state === 'thinking';
    const isSpeaking = state === 'speaking';
    const isIdle = state === 'idle';

    return (
        <div className="orb-container" onClick={onClick} role="button" tabIndex={0} aria-label="Voice input">
            {/* Ambient glow behind orb */}
            <motion.div
                className="orb-ambient"
                animate={{
                    scale: isListening ? [1, 1.3, 1] : isSpeaking ? [1, 1.2, 1] : [1, 1.08, 1],
                    opacity: isListening ? [0.4, 0.7, 0.4] : isSpeaking ? [0.3, 0.6, 0.3] : [0.2, 0.35, 0.2],
                }}
                transition={{
                    duration: isListening ? 1.2 : isSpeaking ? 1.5 : 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Outer ring — rotating during thinking */}
            <motion.div
                className="orb-ring"
                animate={{
                    rotate: isThinking ? 360 : 0,
                    scale: isThinking ? [1, 1.05, 1] : 1,
                    opacity: isThinking ? 0.8 : isListening ? 0.5 : 0.2,
                }}
                transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.5 },
                }}
            />

            {/* Pulse waves — during speaking */}
            <AnimatePresence>
                {isSpeaking && (
                    <>
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={`wave-${i}`}
                                className="orb-wave"
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.6,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Listening ripples */}
            <AnimatePresence>
                {isListening && (
                    <>
                        {[0, 1].map((i) => (
                            <motion.div
                                key={`ripple-${i}`}
                                className="orb-ripple"
                                initial={{ scale: 1, opacity: 0.4 }}
                                animate={{ scale: 2, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.7,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Main orb sphere */}
            <motion.div
                className={`orb-sphere orb-sphere-${state}`}
                animate={{
                    scale: isIdle ? [1, 1.04, 1] : isListening ? [1, 1.08, 1] : isThinking ? [0.96, 1.02, 0.96] : [1, 1.02, 1],
                }}
                transition={{
                    duration: isIdle ? 3.5 : isListening ? 0.8 : isThinking ? 2 : 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Inner gradient overlay */}
                <div className="orb-inner" />

                {/* State icon */}
                <motion.div
                    className="orb-icon"
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {isIdle && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" fillOpacity="0.9" />
                            <path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
                            <path d="M12 19v3M9 22h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
                        </svg>
                    )}
                    {isListening && (
                        <motion.div
                            className="orb-bars"
                            animate={{ gap: ['3px', '5px', '3px'] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                        >
                            {[12, 20, 16, 24, 14].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="orb-bar"
                                    animate={{ height: [h * 0.4, h, h * 0.5, h * 0.8, h * 0.4] }}
                                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            ))}
                        </motion.div>
                    )}
                    {isThinking && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'flex' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
                            </svg>
                        </motion.div>
                    )}
                    {isSpeaking && (
                        <motion.div
                            className="orb-speaker"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" fillOpacity="0.9" />
                                <motion.path
                                    d="M15.5 8.5a5 5 0 0 1 0 7"
                                    stroke="white" strokeWidth="2" strokeLinecap="round"
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <motion.path
                                    d="M18.5 6a8.5 8.5 0 0 1 0 12"
                                    stroke="white" strokeWidth="2" strokeLinecap="round"
                                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                                />
                            </svg>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            {/* State label */}
            <motion.p
                className="orb-label"
                key={state}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isIdle && 'Tap to speak'}
                {isListening && '🎤 सुन रहा हूँ...'}
                {isThinking && '🤖 समझ रहा हूँ...'}
                {isSpeaking && '🔊 बोल रहा हूँ...'}
            </motion.p>
        </div>
    );
}
