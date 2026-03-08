const express = require('express');
const router = express.Router();
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const schemes = require('../data/schemes.json');

// Initialize Bedrock client
let bedrockClient;
try {
    bedrockClient = new BedrockRuntimeClient({
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
} catch (err) {
    console.warn('⚠️  AWS Bedrock client not initialized:', err.message);
}

/**
 * Keyword-based fallback intent detection
 */
function fallbackIntentDetection(text) {
    const lower = text.toLowerCase();

    // Scheme-related keywords (Hindi + English)
    const schemeKeywords = [
        'yojana', 'योजना', 'scheme', 'kisan', 'किसान', 'farmer',
        'paisa', 'पैसा', 'money', 'loan', 'beej', 'बीज', 'seed',
        'subsidy', 'सब्सिडी', 'pension', 'पेंशन', 'ration', 'राशन',
        'gas', 'गैस', 'ghar', 'घर', 'house', 'housing', 'awas', 'आवास',
        'health', 'स्वास्थ्य', 'swasthya', 'hospital', 'अस्पताल',
        'education', 'शिक्षा', 'scholarship', 'छात्रवृत्ति',
        'beti', 'बेटी', 'daughter', 'sukanya', 'सुकन्या',
        'mudra', 'मुद्रा', 'business', 'व्यापार', 'rozgar', 'रोज़गार',
        'employment', 'sarkari', 'सरकारी', 'government', 'sahayata', 'सहायता',
        'help', 'madad', 'मदद', 'benefit', 'labh', 'लाभ',
        'ujjwala', 'उज्ज्वला', 'ayushman', 'आयुष्मान', 'insurance', 'बीमा'
    ];

    // Civic complaint keywords (Hindi + English)
    const civicKeywords = [
        'sadak', 'सड़क', 'road', 'gaddha', 'गड्ढा', 'pothole',
        'bijli', 'बिजली', 'electricity', 'light', 'बत्ती',
        'paani', 'पानी', 'water', 'nali', 'नाली', 'drain', 'sewer',
        'kachra', 'कचरा', 'garbage', 'safai', 'सफाई', 'cleaning',
        'complaint', 'shikayat', 'शिकायत', 'problem', 'samasya', 'समस्या',
        'broken', 'टूटा', 'toota', 'kharab', 'खराब', 'damage',
        'street', 'gali', 'गली', 'nagar', 'नगर', 'municipal',
        'park', 'पार्क', 'toilet', 'शौचालय'
    ];

    const schemeScore = schemeKeywords.filter(kw => lower.includes(kw)).length;
    const civicScore = civicKeywords.filter(kw => lower.includes(kw)).length;

    if (schemeScore > civicScore && schemeScore > 0) {
        // Find best matching scheme
        const matchedScheme = findBestScheme(text);
        return {
            intent: 'SCHEME_INTENT',
            confidence: Math.min(0.9, 0.5 + schemeScore * 0.1),
            scheme: matchedScheme,
            response: matchedScheme
                ? `मैंने आपके लिए "${matchedScheme.name.hi}" योजना खोजी है। ${matchedScheme.description.hi}`
                : 'मैंने कुछ सरकारी योजनाएं खोजी हैं जो आपके काम आ सकती हैं।'
        };
    } else if (civicScore > 0) {
        return {
            intent: 'CIVIC_INTENT',
            confidence: Math.min(0.9, 0.5 + civicScore * 0.1),
            response: 'आपकी शिकायत दर्ज कर ली गई है। स्थानीय अधिकारियों को सूचित किया जाएगा।'
        };
    }

    return {
        intent: 'UNKNOWN_INTENT',
        confidence: 0.3,
        response: 'क्षमा करें, मैं आपकी बात समझ नहीं पाया। कृपया दोबारा बताएं कि आपको सरकारी योजना की जानकारी चाहिए या कोई शिकायत दर्ज करनी है।'
    };
}

/**
 * Find best matching scheme from mock data
 */
function findBestScheme(text) {
    const lower = text.toLowerCase();

    const schemeKeywordMap = {
        'pm-kisan': ['kisan', 'किसान', 'farmer', 'beej', 'बीज', 'kheti', 'खेती', 'agriculture', 'fasal', 'फसल'],
        'ayushman-bharat': ['health', 'स्वास्थ्य', 'hospital', 'अस्पताल', 'bimar', 'बीमार', 'ilaj', 'इलाज', 'treatment', 'ayushman', 'आयुष्मान', 'insurance', 'बीमा'],
        'pm-awas-yojana': ['ghar', 'घर', 'house', 'home', 'awas', 'आवास', 'makaan', 'मकान', 'construction', 'nirman', 'निर्माण'],
        'ujjwala-yojana': ['gas', 'गैस', 'cylinder', 'सिलेंडर', 'rasoi', 'रसोई', 'cooking', 'chulha', 'चूल्हा', 'ujjwala', 'उज्ज्वला', 'lpg'],
        'sukanya-samriddhi': ['beti', 'बेटी', 'daughter', 'girl', 'ladki', 'लड़की', 'sukanya', 'सुकन्या', 'bachat', 'बचत', 'saving'],
        'mudra-yojana': ['business', 'व्यापार', 'vyapar', 'loan', 'rin', 'ऋण', 'dukaan', 'दुकान', 'shop', 'udyam', 'उद्यम', 'mudra', 'मुद्रा', 'rozgar', 'रोज़गार']
    };

    let bestSchemeId = null;
    let bestScore = 0;

    for (const [schemeId, keywords] of Object.entries(schemeKeywordMap)) {
        const score = keywords.filter(kw => lower.includes(kw)).length;
        if (score > bestScore) {
            bestScore = score;
            bestSchemeId = schemeId;
        }
    }

    if (bestSchemeId) {
        return schemes.find(s => s.id === bestSchemeId);
    }

    // Default to PM Kisan if no specific match
    return schemes[0];
}

/**
 * POST /api/detect-intent
 * Accepts { text }, classifies intent using Bedrock or fallback
 */
router.post('/detect-intent', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Try AWS Bedrock with retry + exponential backoff
        if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && bedrockClient) {
            const MAX_RETRIES = 3;
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

                    const prompt = `You are JanSahayak AI, a government services assistant for Indian citizens. Analyze the following user input and classify it.

User Input: "${text}"

Classify the intent into one of these categories:
1. SCHEME_INTENT - User is asking about government schemes, subsidies, financial assistance, benefits
2. CIVIC_INTENT - User is reporting a civic issue, complaint, infrastructure problem
3. UNKNOWN_INTENT - Cannot determine the intent

Also identify the most relevant government scheme if SCHEME_INTENT (from: PM Kisan, Ayushman Bharat, PM Awas Yojana, Ujjwala Yojana, Sukanya Samriddhi, MUDRA Yojana).

Respond ONLY with valid JSON:
{
  "intent": "SCHEME_INTENT|CIVIC_INTENT|UNKNOWN_INTENT",
  "confidence": 0.0-1.0,
  "schemeId": "pm-kisan|ayushman-bharat|pm-awas-yojana|ujjwala-yojana|sukanya-samriddhi|mudra-yojana|null",
  "response": "A helpful response in Hindi for the user (max 2 sentences)"
}`;

                    const payload = {
                        anthropic_version: "bedrock-2023-05-31",
                        max_tokens: 300,
                        messages: [{ role: "user", content: prompt }]
                    };

                    const command = new InvokeModelCommand({
                        modelId,
                        contentType: 'application/json',
                        accept: 'application/json',
                        body: JSON.stringify(payload)
                    });

                    const response = await bedrockClient.send(command);
                    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
                    const content = responseBody.content[0].text;

                    // Parse the JSON from Claude's response
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const result = JSON.parse(jsonMatch[0]);

                        // Attach full scheme data if scheme intent
                        if (result.intent === 'SCHEME_INTENT' && result.schemeId) {
                            result.scheme = schemes.find(s => s.id === result.schemeId) || schemes[0];
                        }

                        return res.json({ ...result, source: 'aws-bedrock' });
                    }
                    break; // Valid response but no JSON — fall through to fallback
                } catch (bedrockError) {
                    console.error(`Bedrock attempt ${attempt}/${MAX_RETRIES} failed:`, bedrockError.message);
                    if (attempt < MAX_RETRIES) {
                        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            console.warn('All Bedrock retries exhausted, using keyword fallback');
        }

        // Fallback: keyword-based intent detection
        const result = fallbackIntentDetection(text);
        res.json({ ...result, source: 'fallback' });

    } catch (error) {
        console.error('Intent detection error:', error.message);
        res.status(500).json({ error: 'Intent detection failed', message: error.message });
    }
});

module.exports = router;
