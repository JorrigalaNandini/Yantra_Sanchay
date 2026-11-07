const Assessment = require('../models/Assessment');

const aiService = {
    assessFarmImage: async (farmerData, imagePath) => {
        try {
            // Check if AI API is available
            const aiApiKey = process.env.AI_API_KEY;

            if (!aiApiKey) {
                console.warn('AI_API_KEY not configured. Using fallback assessment.');
                return {
                    status: 'unavailable',
                    message: 'AI assessment service is currently unavailable. Please try again when connectivity is restored.',
                    recommendations: [],
                };
            }

            // Placeholder for actual AI integration
            // This architecture allows future AI model/API integration
            // Example: Can integrate with Google Cloud Vision, AWS Rekognition, or custom ML models

            const assessment = {
                detectedCrop: 'Unknown',
                farmSize: farmerData.farmSize || 0,
                soilType: 'Not determined',
                cropHealth: 'Good',
                irrigationStatus: 'Present',
            };

            const recommendations = [
                {
                    machinery: 'Tractor',
                    reason: 'Universal use for farm preparation',
                    priority: 'high',
                },
                {
                    machinery: 'Rotavator',
                    reason: 'Soil preparation and tilling',
                    priority: 'high',
                },
                {
                    machinery: 'Sprayer',
                    reason: 'Pesticide and fertilizer application',
                    priority: 'medium',
                },
            ];

            return {
                status: 'success',
                assessment,
                recommendations,
            };
        } catch (error) {
            console.error('AI Service Error:', error.message);
            return {
                status: 'error',
                message: 'AI assessment failed. Please try again.',
                recommendations: [],
            };
        }
    },

    getRecommendations: async (crop, farmSize) => {
        try {
            // Rule-based recommendation engine
            const recommendationMap = {
                paddy: {
                    machinery: ['Tractor', 'Rotavator', 'Paddy Transplanter', 'Thresher'],
                    smallFarm: ['Tiller', 'Manual Sprayer'],
                    largeFarm: ['Tractor', 'Combine Harvester'],
                },
                wheat: {
                    machinery: ['Tractor', 'Seed Drill', 'Sprayer', 'Harvester'],
                    smallFarm: ['Hand tools', 'Sprayer'],
                    largeFarm: ['Tractor', 'Combine Harvester'],
                },
                maize: {
                    machinery: ['Tractor', 'Planter', 'Sprayer', 'Harvester'],
                    smallFarm: ['Manual Planter', 'Sprayer'],
                    largeFarm: ['Tractor', 'Mechanical Planter'],
                },
                sugarcane: {
                    machinery: ['Tractor', 'Sugarcane Planter', 'Trailer'],
                    smallFarm: ['Manual tools'],
                    largeFarm: ['Sugarcane Harvester'],
                },
            };

            const cropRecs = recommendationMap[crop?.toLowerCase()] || recommendationMap['wheat'];
            const sizeCategory = farmSize > 5 ? 'largeFarm' : 'smallFarm';

            return {
                success: true,
                recommendations: {
                    general: cropRecs.machinery,
                    specific: cropRecs[sizeCategory],
                },
            };
        } catch (error) {
            console.error('Recommendation Error:', error.message);
            return {
                success: false,
                recommendations: [],
            };
        }
    },
};

module.exports = aiService;
