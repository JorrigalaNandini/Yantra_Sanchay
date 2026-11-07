const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema(
    {
        machineryName: {
            type: String,
            required: [true, 'Please provide machinery name'],
        },
        category: {
            type: String,
            enum: [
                'Tractor',
                'Harvester',
                'Cultivator',
                'Rotavator',
                'Seed Drill',
                'Planter',
                'Sprayer',
                'Thresher',
                'Tiller',
                'Plough',
                'Trailer',
                'Irrigation Equipment',
                'Paddy Machinery',
                'Harvesting Machinery',
                'Other',
            ],
            required: true,
        },
        type: String,
        brand: String,
        model: String,
        manufacturingYear: Number,
        description: String,
        specifications: {
            power: String,
            capacity: String,
            transmission: String,
            width: String,
            fuelType: String,
            other: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        images: [String],
        location: {
            village: String,
            mandal: String,
            district: String,
            state: String,
        },
        availability: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            availableFrom: Date,
            availableTill: Date,
        },
        pricing: {
            price: Number,
            unit: {
                type: String,
                enum: ['per_hour', 'per_day', 'per_week', 'per_acre'],
            },
        },
        suitableCrops: [String],
        suitableFarmSize: {
            min: Number,
            max: Number,
            unit: String,
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            default: 'good',
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        verificationRemarks: String,
        verifiedBy: mongoose.Schema.Types.ObjectId,
        totalRequests: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
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

// Index for search
machinerySchema.index({ category: 1, 'location.district': 1 });
machinerySchema.index({ machineryName: 'text', description: 'text' });

module.exports = mongoose.model('Machinery', machinerySchema);
