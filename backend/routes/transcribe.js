const express = require('express');
const router = express.Router();
const multer = require('multer');
const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Initialize AWS clients
let transcribeClient, s3Client;
try {
    const config = {
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    };
    transcribeClient = new TranscribeClient(config);
    s3Client = new S3Client(config);
} catch (err) {
    console.warn('⚠️  AWS Transcribe client not initialized:', err.message);
}

/**
 * POST /api/transcribe
 * Accepts audio file, transcribes using Amazon Transcribe
 * Falls back to returning a flag for browser-based STT
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        // If no audio file provided, return error
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        // If text was sent directly (from browser STT), just echo it back
        if (req.body.text) {
            return res.json({ text: req.body.text, source: 'browser' });
        }

        // Check if AWS is configured
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            console.log('⚠️  AWS credentials not set — returning fallback flag');
            return res.json({ text: '', useBrowserSTT: true, source: 'fallback' });
        }

        const jobName = `jansahayak-${uuidv4()}`;
        const s3Key = `audio/${jobName}.webm`;
        const bucketName = process.env.S3_BUCKET_NAME || 'jansahayak-transcribe-bucket';

        // Upload audio to S3
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype || 'audio/webm'
        }));

        // Start transcription job
        await transcribeClient.send(new StartTranscriptionJobCommand({
            TranscriptionJobName: jobName,
            LanguageCode: 'hi-IN',
            MediaFormat: 'webm',
            Media: {
                MediaFileUri: `s3://${bucketName}/${s3Key}`
            },
            IdentifyLanguage: true,
            LanguageOptions: ['hi-IN', 'en-IN']
        }));

        // Poll for completion (max 30 seconds)
        let transcript = '';
        let detectedLanguage = 'hi';
        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await transcribeClient.send(new GetTranscriptionJobCommand({
                TranscriptionJobName: jobName
            }));

            const status = result.TranscriptionJob.TranscriptionJobStatus;
            if (status === 'COMPLETED') {
                const transcriptUri = result.TranscriptionJob.Transcript.TranscriptFileUri;
                // Fetch the transcript from the URI
                const response = await fetch(transcriptUri);
                const data = await response.json();
                transcript = data.results.transcripts[0].transcript;
                detectedLanguage = result.TranscriptionJob.LanguageCode?.startsWith('en') ? 'en' : 'hi';
                break;
            } else if (status === 'FAILED') {
                throw new Error('Transcription job failed');
            }
        }

        // Clean up S3
        try {
            await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
        } catch (e) { /* ignore cleanup errors */ }

        res.json({ text: transcript, language: detectedLanguage, source: 'aws-transcribe' });

    } catch (error) {
        console.error('Transcribe error:', error.message);
        // Fallback: tell frontend to use browser STT
        res.json({ text: '', useBrowserSTT: true, source: 'fallback', error: error.message });
    }
});

module.exports = router;
