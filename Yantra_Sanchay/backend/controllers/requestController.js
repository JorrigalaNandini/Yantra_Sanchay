const MachineryRequest = require('../models/MachineryRequest');
const Machinery = require('../models/Machinery');
const User = require('../models/User');

const requestController = {
    // Create machinery request
    create: async (req, res) => {
        try {
            const { machineryId, requiredDate, requiredDuration, location, farmSize, crop, additionalRequirements } = req.body;

            const machinery = await Machinery.findById(machineryId);
            if (!machinery) {
                return res.status(404).json({
                    success: false,
                    message: 'Machinery not found.',
                });
            }

            const request = new MachineryRequest({
                machinery: machineryId,
                farmer: req.user._id,
                provider: machinery.owner,
                requiredDate,
                requiredDuration,
                location,
                farmSize,
                crop,
                additionalRequirements,
                contactInformation: {
                    name: req.user.name,
                    phone: req.user.phone,
                    email: req.user.email,
                },
            });

            await request.save();

            // Update machinery request count
            machinery.totalRequests = (machinery.totalRequests || 0) + 1;
            await machinery.save();

            res.status(201).json({
                success: true,
                message: 'Request created successfully.',
                data: request,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating request.',
                error: error.message,
            });
        }
    },

    // Get all requests (with filters)
    getAll: async (req, res) => {
        try {
            const { status, role } = req.query;
            const filter = {};

            if (status) filter.status = status;

            let requests;
            if (req.user.role === 'farmer') {
                requests = await MachineryRequest.find({ farmer: req.user._id, ...filter })
                    .populate('machinery')
                    .populate('provider', 'name phone email profile.organizationName');
            } else if (req.user.role === 'machinery_provider') {
                requests = await MachineryRequest.find({ provider: req.user._id, ...filter })
                    .populate('machinery')
                    .populate('farmer', 'name phone email profile');
            } else {
                // Admin can see all
                requests = await MachineryRequest.find(filter).populate('machinery').populate('farmer').populate('provider');
            }

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

    // Get request by ID
    getById: async (req, res) => {
        try {
            const request = await MachineryRequest.findById(req.params.id)
                .populate('machinery')
                .populate('farmer', 'name phone email profile')
                .populate('provider', 'name phone email profile');

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message: 'Request not found.',
                });
            }

            res.json({
                success: true,
                data: request,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching request.',
                error: error.message,
            });
        }
    },

    // Update request status
    updateStatus: async (req, res) => {
        try {
            const { status, notes } = req.body;

            const request = await MachineryRequest.findById(req.params.id);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message: 'Request not found.',
                });
            }

            // Check authorization
            if (request.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this request.',
                });
            }

            request.status = status;
            if (notes) request.notes = notes;
            if (status === 'approved') request.approvedDate = new Date();
            if (status === 'completed') request.completedDate = new Date();

            await request.save();

            res.json({
                success: true,
                message: 'Request updated successfully.',
                data: request,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating request.',
                error: error.message,
            });
        }
    },

    // Get user's requests
    getUserRequests: async (req, res) => {
        try {
            const requests = await MachineryRequest.find({ farmer: req.user._id })
                .populate('machinery')
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
};

module.exports = requestController;
