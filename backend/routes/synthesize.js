const express = require('express');
const router = express.Router();
const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');

// Initialize Polly client
let pollyClient;
try {
    pollyClient = new PollyClient({
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
} catch (err) {
    console.warn('⚠️  AWS Polly client not initialized:', err.message);
}

/**
 * POST /api/synthesize
 * Accepts { text, language }, returns MP3 audio or fallback flag
 */
router.post('/synthesize', async (req, res) => {
    try {
        const { text, language = 'hi' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Check if AWS is configured
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !pollyClient) {
            return res.json({ useBrowserTTS: true, text, language, source: 'fallback' });
        }

        const voiceId = language === 'en'
            ? (process.env.POLLY_VOICE_ENGLISH || 'Aditi')
            : (process.env.POLLY_VOICE_HINDI || 'Aditi');

        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voiceId,
            Engine: 'standard',
            LanguageCode: language === 'en' ? 'en-IN' : 'hi-IN'
        });

        const response = await pollyClient.send(command);

        // Stream the audio response
        const audioStream = response.AudioStream;
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);

    } catch (error) {
        console.error('Polly error:', error.message);
        // Fallback: tell frontend to use browser TTS
        res.json({ useBrowserTTS: true, text: req.body?.text, language: req.body?.language || 'hi', source: 'fallback', error: error.message });
    }
});

module.exports = router;
