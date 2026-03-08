const API_BASE = 'http://localhost:3001/api';

/**
 * Send audio blob to backend for transcription
 */
export async function transcribeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Transcription failed');
    return response.json();
}

/**
 * Send transcribed text directly (when using browser STT)
 */
export async function sendTranscribedText(text) {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(`${API_BASE}/transcribe`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Transcription failed');
    return response.json();
}

/**
 * Detect intent from text
 */
export async function detectIntent(text) {
    const response = await fetch(`${API_BASE}/detect-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Intent detection failed');
    return response.json();
}

/**
 * Get all schemes
 */
export async function getSchemes() {
    const response = await fetch(`${API_BASE}/schemes`);
    if (!response.ok) throw new Error('Failed to fetch schemes');
    return response.json();
}

/**
 * Get single scheme by ID
 */
export async function getScheme(id) {
    const response = await fetch(`${API_BASE}/schemes/${id}`);
    if (!response.ok) throw new Error('Scheme not found');
    return response.json();
}

/**
 * Submit a civic complaint
 */
export async function submitComplaint(data) {
    const response = await fetch(`${API_BASE}/complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Complaint submission failed');
    return response.json();
}

/**
 * Synthesize speech from text via Polly
 * Returns: audio blob (MP3) or fallback flag
 */
export async function synthesizeSpeech(text, language = 'hi') {
    try {
        const response = await fetch(`${API_BASE}/synthesize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language })
        });

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('audio/mpeg')) {
            const audioBlob = await response.blob();
            return { audioBlob, source: 'polly' };
        }

        // JSON response means fallback
        const data = await response.json();
        return { useBrowserTTS: true, text, language, source: 'fallback' };

    } catch (error) {
        return { useBrowserTTS: true, text, language, source: 'error' };
    }
}

/**
 * Health check
 */
export async function healthCheck() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
