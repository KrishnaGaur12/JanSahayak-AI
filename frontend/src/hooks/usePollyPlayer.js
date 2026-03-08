import { useState, useRef, useCallback } from 'react';
import { synthesizeSpeech } from '../services/api';

/**
 * Custom hook for playing speech audio.
 * Tries Amazon Polly first, falls back to browser SpeechSynthesis.
 */
export function usePollyPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const utteranceRef = useRef(null);

    /**
     * Speak the given text using Polly or browser TTS
     */
    const speak = useCallback(async (text, language = 'hi') => {
        if (!text) return;

        // Stop any current playback
        stop();

        try {
            setIsPlaying(true);
            const result = await synthesizeSpeech(text, language);

            if (result.audioBlob && result.source === 'polly') {
                // Play Polly MP3 audio
                const audioUrl = URL.createObjectURL(result.audioBlob);
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl);
                };

                audio.onerror = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl);
                    // Fallback to browser TTS on playback error
                    speakWithBrowser(text, language);
                };

                await audio.play();
            } else {
                // Use browser TTS
                speakWithBrowser(text, language);
            }
        } catch (err) {
            console.error('Speech playback error:', err);
            speakWithBrowser(text, language);
        }
    }, []);

    /**
     * Browser-native TTS fallback
     */
    const speakWithBrowser = useCallback((text, language = 'hi') => {
        if (!window.speechSynthesis) {
            setIsPlaying(false);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';
        utterance.rate = 0.85; // Slower speech for elderly users
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to find a Hindi voice
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith(language === 'en' ? 'en' : 'hi'));
        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    }, []);

    /**
     * Stop current playback
     */
    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
    }, []);

    return { isPlaying, speak, stop };
}
