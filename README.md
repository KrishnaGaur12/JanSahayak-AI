# 🇮🇳 JanSahayak AI — जनसहायक एआई

> **Voice-first AI assistant** that connects Indian citizens to government schemes, services, and civic complaint systems — in **Hindi & English**.

Just press a button and speak. Ask about government schemes, file a complaint, or get instant answers — powered by AWS AI services.

---

## ✨ What It Does

| Feature | Description |
|---|---|
| 🎤 **Voice Input** | Speak naturally in Hindi or English — AI understands both |
| 🏛️ **Scheme Discovery** | Find matching government schemes (PM Kisan, Ayushman Bharat, etc.) |
| 📝 **Civic Complaints** | File road, electricity, or water complaints by just speaking |
| 🔊 **Voice Response** | Hear answers spoken back via Amazon Polly |
| 🔍 **Complaint Tracking** | Track complaint status with a tracking ID |
| ⌨️ **Text Input** | Type queries if you prefer text over voice |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + Vite
- **Framer Motion** — animations
- **Web Speech API** — browser-native speech recognition
- **Vanilla CSS** — custom design system

### Backend
- **Node.js** + Express
- **AWS Bedrock** (Claude) — intent detection & AI responses
- **Amazon Transcribe** — speech-to-text
- **Amazon Polly** — text-to-speech
- **Amazon S3** — audio file storage

---

## 📁 Project Structure

```
JanSahayak-AI/
├── frontend/                # React app (Vite)
│   ├── src/
│   │   ├── components/      # AiOrb, Header, TextInput, SuggestionChips
│   │   ├── pages/           # LandingPage, VoiceHome, SchemeResult, etc.
│   │   ├── hooks/           # useVoiceRecorder, usePollyPlayer
│   │   ├── services/        # API client (api.js)
│   │   └── index.css        # Global design tokens
│   └── package.json
├── backend/                 # Express API server
│   ├── routes/              # transcribe, intent, schemes, complaint, synthesize
│   ├── data/                # Schemes database (JSON)
│   ├── server.js            # Entry point
│   ├── .env.example         # Environment variable template
│   └── package.json
├── design.md                # Design principles & architecture
├── requirements.md          # Detailed requirements spec
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **AWS Account** with access to Bedrock, Transcribe, Polly, and S3

### 1. Clone the repo
```bash
git clone https://github.com/KrishnaGaur12/JanSahayak-AI.git
cd JanSahayak-AI
```

### 2. Setup Backend
```bash
cd backend
npm install

# Copy the example env and fill in your AWS credentials
cp .env.example .env
# Edit .env with your AWS keys and config

npm start
# Server runs on http://localhost:3001
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. Open the app
Visit **http://localhost:5173** in your browser and click **"Start Talking"**.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
S3_BUCKET_NAME=your-s3-bucket-name
PORT=3001
```

---

## 🎯 How It Works

1. **User speaks** (or types) a query in Hindi or English
2. **Browser STT** transcribes speech in real-time (Web Speech API)
3. **Backend AI** (AWS Bedrock / Claude) classifies the intent:
   - `SCHEME_INTENT` → returns matching government scheme details
   - `CIVIC_INTENT` → registers a civic complaint with a tracking ID
   - `GENERAL` → provides a helpful AI response
4. **Voice response** is generated via Amazon Polly and played back

---

## 📸 Screenshots

### Landing Page
Clean, modern design with clear CTAs and service overview.

### Voice Interface
Bright, warm UI with an interactive AI orb — tap to speak.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ for India</p>