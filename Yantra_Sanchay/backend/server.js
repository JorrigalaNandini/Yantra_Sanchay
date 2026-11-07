require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const machineryRoutes = require('./routes/machineryRoutes');
const requestRoutes = require('./routes/requestRoutes');
const poolingRoutes = require('./routes/poolingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/pooling', poolingRoutes);
app.use('/api/admin', adminRoutes);

// Translation API (forwarding to Python service)
app.post('/api/translate', async (req, res) => {
    try {
        const { text, source, target } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Text is required for translation.',
            });
        }

        const translationServiceUrl = process.env.TRANSLATION_SERVICE_URL || 'http://127.0.0.1:8000';

        const response = await axios.post(`${translationServiceUrl}/translate`, {
            text,
            source: source || 'english',
            target: target || 'telugu',
        });

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Translation service is currently unavailable.',
            originalText: req.body.text,
        });
    }
});

// Assessment API
app.post('/api/assessment', async (req, res) => {
    try {
        const aiService = require('./services/aiService');
        const Assessment = require('./models/Assessment');

        const { image, farmSize, crop } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image is required for assessment.',
            });
        }

        // Get AI assessment
        const assessmentResult = await aiService.assessFarmImage({ farmSize, crop }, image);

        // Get recommendations
        const recommendations = await aiService.getRecommendations(crop, farmSize);

        res.json({
            success: true,
            data: {
                assessment: assessmentResult.assessment || {},
                recommendations: recommendations.recommendations || [],
                status: assessmentResult.status,
                message: assessmentResult.message,
            },
        });
    } catch (error) {
        console.error('Assessment error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Assessment failed.',
            error: error.message,
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found.',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`  - Auth: POST /api/auth/register, /api/auth/login`);
    console.log(`  - Machinery: GET/POST /api/machinery`);
    console.log(`  - Requests: GET/POST /api/requests`);
    console.log(`  - Pooling: GET/POST /api/pooling`);
    console.log(`  - Translation: POST /api/translate`);
    console.log(`  - Assessment: POST /api/assessment`);
    console.log(`  - Admin: GET /api/admin/statistics`);
});

module.exports = app;
