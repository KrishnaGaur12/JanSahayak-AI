require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const transcribeRoutes = require('./routes/transcribe');
const intentRoutes = require('./routes/intent');
const schemesRoutes = require('./routes/schemes');
const complaintRoutes = require('./routes/complaint');
const synthesizeRoutes = require('./routes/synthesize');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'JanSahayak AI Backend', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', transcribeRoutes);
app.use('/api', intentRoutes);
app.use('/api', schemesRoutes);
app.use('/api', complaintRoutes);
app.use('/api', synthesizeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 JanSahayak AI Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 AWS Region: ${process.env.AWS_REGION || 'not set'}`);
  console.log(`🤖 Bedrock Model: ${process.env.BEDROCK_MODEL_ID || 'not set'}\n`);
});
