const mongoose = require('mongoose');

const machineryPoolingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        machineryType: {
            type: String,
            required: true,
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
            mandal: String,
            district: String,
            state: String,
        },
        crop: String,
        farmSize: {
            value: Number,
            unit: String,
        },
        targetParticipants: Number,
        currentParticipants: {
            type: Number,
            default: 0,
        },
        participants: [
            {
                farmer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                joinedAt: Date,
                farmSize: Number,
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'forming', 'confirmed', 'completed', 'cancelled'],
            default: 'open',
        },
        selectedMachinery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machinery',
        },
        totalCost: Number,
        costPerParticipant: Number,
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

module.exports = mongoose.model('MachineryPooling', machineryPoolingSchema);
