const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        email: {
            type: String,
            lowercase: true,
            sparse: true,
            unique: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['farmer', 'machinery_provider', 'admin'],
            default: 'farmer',
        },
        preferredLanguage: {
            type: String,
            enum: ['english', 'telugu', 'hindi'],
            default: 'english',
        },
        profile: {
            fullName: String,
            village: String,
            mandal: String,
            district: String,
            state: String,
            profileImage: String,
            // Farmer specific
            farmSize: Number,
            farmSizeUnit: String,
            cropsGrown: [String],
            irrigationType: String,
            // Provider specific
            organizationName: String,
            providerType: {
                type: String,
                enum: [
                    'Individual Owner',
                    'Custom Hiring Centre',
                    'Farmer Producer Organization',
                    'Cooperative',
                    'Agricultural Institution',
                    'Government Machinery Centre',
                    'Other',
                ],
            },
            verificationStatus: {
                type: String,
                enum: ['pending', 'verified', 'rejected'],
                default: 'pending',
            },
        },
        location: {
            latitude: Number,
            longitude: Number,
            village: String,
            district: String,
            state: String,
            accuracy: Number,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
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

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
