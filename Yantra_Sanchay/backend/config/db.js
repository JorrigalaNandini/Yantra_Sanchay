const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.warn('MONGO_URI not set. Using local MongoDB connection.');
        }

        await mongoose.connect(mongoUri || 'mongodb://localhost:27017/yantra_sanchay', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
