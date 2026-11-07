const User = require('../models/User');
const Machinery = require('../models/Machinery');
const MachineryRequest = require('../models/MachineryRequest');
const MachineryPooling = require('../models/MachineryPooling');
const Assessment = require('../models/Assessment');

const userController = {
    getDashboard: async (req, res) => {
        try {
            const farmerId = req.user._id;

            const [machineryAvailable, myRequests, poolingGroups, recommendations] = await Promise.all([
                Machinery.countDocuments({
                    'availability.isAvailable': { $ne: false },
                }),
                MachineryRequest.countDocuments({ farmer: farmerId }),
                MachineryPooling.countDocuments({
                    $or: [{ createdBy: farmerId }, { 'participants.farmer': farmerId }],
                }),
                Assessment.countDocuments({ farmer: farmerId }),
            ]);

            res.json({
                success: true,
                data: {
                    machineryAvailable,
                    myRequests,
                    poolingGroups,
                    recommendations,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard statistics.',
                error: error.message,
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const users = await User.find();
            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching users.',
                error: error.message,
            });
        }
    },

    getById: async (req, res) => {
        try {
            const isOwnProfile = req.user._id.toString() === req.params.id;
            const isAdmin = req.user.role === 'admin';

            if (!isOwnProfile && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied.',
                });
            }

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }
            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user.',
                error: error.message,
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { name, phone, preferredLanguage, profile, location } = req.body;

            const updateData = {};
            if (name) updateData.name = name;
            if (phone) updateData.phone = phone;
            if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
            if (profile) updateData.profile = profile;
            if (location) updateData.location = location;

            const user = await User.findByIdAndUpdate(req.user._id, updateData, {
                new: true,
                runValidators: true,
            });

            res.json({
                success: true,
                message: 'Profile updated successfully.',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating profile.',
                error: error.message,
            });
        }
    },

    updateById: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully.',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating user.',
                error: error.message,
            });
        }
    },

    delete: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully.',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting user.',
                error: error.message,
            });
        }
    },
};

module.exports = userController;
