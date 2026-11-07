const mongoose = require('mongoose');

const machineryRequestSchema = new mongoose.Schema(
    {
        machinery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machinery',
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        requiredDate: {
            type: Date,
            required: true,
        },
        requiredDuration: {
            value: Number,
            unit: {
                type: String,
                enum: ['hours', 'days', 'weeks'],
            },
        },
        location: {
            village: String,
            district: String,
            state: String,
        },
        farmSize: {
            value: Number,
            unit: String,
        },
        crop: String,
        additionalRequirements: String,
        contactInformation: {
            name: String,
            phone: String,
            email: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
            default: 'pending',
        },
        approvedDate: Date,
        completedDate: Date,
        notes: String,
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

module.exports = mongoose.model('MachineryRequest', machineryRequestSchema);
