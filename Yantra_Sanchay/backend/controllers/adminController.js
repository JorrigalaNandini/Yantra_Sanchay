const User = require('../models/User');
const Machinery = require('../models/Machinery');
const MachineryRequest = require('../models/MachineryRequest');
const MachineryPooling = require('../models/MachineryPooling');

const adminController = {
    // Get statistics
    getStatistics: async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            const totalFarmers = await User.countDocuments({ role: 'farmer' });
            const totalProviders = await User.countDocuments({ role: 'machinery_provider' });
            const totalMachinery = await Machinery.countDocuments();
            const verifiedMachinery = await Machinery.countDocuments({ verificationStatus: 'verified' });
            const pendingMachinery = await Machinery.countDocuments({ verificationStatus: 'pending' });
            const totalRequests = await MachineryRequest.countDocuments();
            const activePools = await MachineryPooling.countDocuments({ status: { $in: ['open', 'forming', 'confirmed'] } });

            // District-wise machinery statistics
            const districtStats = await Machinery.aggregate([
                {
                    $group: {
                        _id: '$location.district',
                        count: { $sum: 1 },
                        verified: {
                            $sum: {
                                $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0],
                            },
                        },
                    },
                },
            ]);

            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalFarmers,
                    totalProviders,
                    totalMachinery,
                    verifiedMachinery,
                    pendingMachinery,
                    totalRequests,
                    activePools,
                    districtStats,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching statistics.',
                error: error.message,
            });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const { role } = req.query;
            const filter = {};
            if (role) filter.role = role;

            const users = await User.find(filter);

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

    // Get all machinery (admin view)
    getAllMachinery: async (req, res) => {
        try {
            const { status } = req.query;
            const filter = {};
            if (status) filter.verificationStatus = status;

            const machinery = await Machinery.find(filter).populate('owner', 'name email phone');

            res.json({
                success: true,
                data: machinery,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching machinery.',
                error: error.message,
            });
        }
    },

    // Verify machinery
    verifyMachinery: async (req, res) => {
        try {
            const { status, remarks } = req.body;

            const machinery = await Machinery.findByIdAndUpdate(
                req.params.id,
                {
                    verificationStatus: status,
                    verificationRemarks: remarks,
                    verifiedBy: req.user._id,
                },
                { new: true }
            );

            if (!machinery) {
                return res.status(404).json({
                    success: false,
                    message: 'Machinery not found.',
                });
            }

            res.json({
                success: true,
                message: 'Machinery verification updated.',
                data: machinery,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error verifying machinery.',
                error: error.message,
            });
        }
    },

    // Get all requests (admin view)
    getAllRequests: async (req, res) => {
        try {
            const requests = await MachineryRequest.find()
                .populate('machinery')
                .populate('farmer', 'name phone')
                .populate('provider', 'name phone');

            res.json({
                success: true,
                data: requests,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching requests.',
                error: error.message,
            });
        }
    },

    // Get all pooling (admin view)
    getAllPooling: async (req, res) => {
        try {
            const pooling = await MachineryPooling.find()
                .populate('createdBy', 'name')
                .populate('participants.farmer', 'name');

            res.json({
                success: true,
                data: pooling,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching pooling.',
                error: error.message,
            });
        }
    },

    // Activate/Deactivate user
    toggleUserStatus: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }

            user.isActive = !user.isActive;
            await user.save();

            res.json({
                success: true,
                message: 'User status updated.',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating user status.',
                error: error.message,
            });
        }
    },
};

module.exports = adminController;
