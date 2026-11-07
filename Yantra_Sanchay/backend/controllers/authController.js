const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, phone, password, role, preferredLanguage, location } = req.body;

            // Validation
            if (!name || !phone || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide name, phone, password, and role.',
                });
            }

            const allowedRoles = ['farmer', 'machinery_provider'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Please register as a farmer or machinery provider.',
                });
            }

            if (role === 'machinery_provider' && !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required for machinery providers.',
                });
            }

            // Check if user with same name and phone exists
            const existingUser = await User.findOne({ name, phone });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this name and phone number already exists.',
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = new User({
                name,
                email: email || `${name.replace(/\s+/g, '').toLowerCase()}_${phone}@yantra.local`,
                phone,
                password: hashedPassword,
                role,
                preferredLanguage: preferredLanguage || 'english',
                location: location || {},
            });

            await user.save();

            // Generate token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '7d',
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully.',
                data: {
                    user: user.toJSON(),
                    token,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Registration failed.',
                error: error.message,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { name, phone, password } = req.body;

            // Support both new format (name + phone) and legacy (email + password)
            let user;
            if (name && phone) {
                if (!password) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please provide name, phone, and password.',
                    });
                }
                user = await User.findOne({ name, phone }).select('+password');
            } else {
                // Fallback for legacy email login
                const { email } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please provide name/phone and password, or email and password.',
                    });
                }
                user = await User.findOne({ email }).select('+password');
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials.',
                });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials.',
                });
            }

            if (user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'This account has been deactivated. Please contact administration.',
                });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
                expiresIn: '7d',
            });

            res.json({
                success: true,
                message: 'Login successful.',
                data: {
                    user: user.toJSON(),
                    token,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Login failed.',
                error: error.message,
            });
        }
    },

    getCurrentUser: async (req, res) => {
        try {
            res.json({
                success: true,
                data: req.user.toJSON(),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user.',
                error: error.message,
            });
        }
    },

    logout: (req, res) => {
        res.json({
            success: true,
            message: 'Logged out successfully.',
        });
    },
};

module.exports = authController;
