import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for recording audio from the microphone.
 * Uses MediaRecorder API to capture audio as WebM blobs.
 * Also includes Web Speech API recognition as a parallel channel.
 */
export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);
    const [browserTranscript, setBrowserTranscript] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);

    /**
     * Start recording audio and optionally browser STT
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            setBrowserTranscript('');
            chunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            streamRef.current = stream;

            // Set up MediaRecorder for audio blob
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : 'audio/webm'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(250); // Collect data every 250ms

            // Also start Web Speech API recognition as parallel channel
            startBrowserSTT();

            setIsRecording(true);
        } catch (err) {
            const message = err.name === 'NotAllowedError'
                ? 'Microphone access denied. Please allow microphone access.'
                : 'Could not access microphone.';
            setError(message);
            console.error('Voice recorder error:', err);
        }
    }, []);

    /**
     * Stop recording and return audio blob + browser transcript
     */
    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
                resolve({ audioBlob: null, transcript: browserTranscript });
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                chunksRef.current = [];

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                    streamRef.current = null;
                }

                resolve({ audioBlob, transcript: recognitionRef.current?._finalTranscript || browserTranscript });
            };

            mediaRecorderRef.current.stop();
            stopBrowserSTT();
            setIsRecording(false);
        });
    }, [browserTranscript]);

    /**
     * Start browser-native speech recognition
     */
    const startBrowserSTT = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Hindi primary, also picks up English
        recognition.maxAlternatives = 1;

        recognition._finalTranscript = '';

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim = transcript;
                }
            }
            if (final) {
                recognition._finalTranscript += final;
            }
            setBrowserTranscript(recognition._finalTranscript + interim);
        };

        recognition.onerror = (event) => {
            if (event.error !== 'aborted') {
                console.warn('Browser STT error:', event.error);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    }, []);

    /**
     * Stop browser speech recognition
     */
    const stopBrowserSTT = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { /* ignore */ }
        }
    }, []);

    return {
        isRecording,
        error,
        browserTranscript,
        startRecording,
        stopRecording
    };
}
