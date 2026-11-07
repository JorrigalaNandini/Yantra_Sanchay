const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        assessmentData: {
            detectedCrop: String,
            farmSize: Number,
            soilType: String,
            cropHealth: String,
            irrigationStatus: String,
        },
        recommendations: [
            {
                machinery: String,
                reason: String,
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low'],
                },
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        errorMessage: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
