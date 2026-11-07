const MachineryPooling = require('../models/MachineryPooling');
const Machinery = require('../models/Machinery');

const poolingController = {
    // Create pooling
    create: async (req, res) => {
        try {
            const { title, description, machineryType, requiredDate, requiredDuration, location, crop, farmSize, targetParticipants } = req.body;

            const pooling = new MachineryPooling({
                title,
                description,
                machineryType,
                requiredDate,
                requiredDuration,
                location,
                crop,
                farmSize,
                targetParticipants,
                createdBy: req.user._id,
                participants: [
                    {
                        farmer: req.user._id,
                        joinedAt: new Date(),
                        farmSize: farmSize?.value || 0,
                    },
                ],
                currentParticipants: 1,
            });

            await pooling.save();

            res.status(201).json({
                success: true,
                message: 'Pooling created successfully.',
                data: pooling,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating pooling.',
                error: error.message,
            });
        }
    },

    // Get all pooling
    getAll: async (req, res) => {
        try {
            const { status, location } = req.query;
            const filter = {};

            if (status) filter.status = status;
            if (location) filter['location.district'] = location;

            const pooling = await MachineryPooling.find(filter)
                .populate('createdBy', 'name phone profile')
                .populate('participants.farmer', 'name profile');

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

    // Get single pooling
    getById: async (req, res) => {
        try {
            const pooling = await MachineryPooling.findById(req.params.id)
                .populate('createdBy', 'name phone email profile')
                .populate('participants.farmer', 'name phone profile')
                .populate('selectedMachinery');

            if (!pooling) {
                return res.status(404).json({
                    success: false,
                    message: 'Pooling not found.',
                });
            }

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

    // Join pooling
    joinPooling: async (req, res) => {
        try {
            const pooling = await MachineryPooling.findById(req.params.id);

            if (!pooling) {
                return res.status(404).json({
                    success: false,
                    message: 'Pooling not found.',
                });
            }

            // Check if already joined
            const alreadyJoined = pooling.participants.some((p) => p.farmer.toString() === req.user._id.toString());

            if (alreadyJoined) {
                return res.status(400).json({
                    success: false,
                    message: 'Already joined this pooling.',
                });
            }

            if (pooling.currentParticipants >= pooling.targetParticipants) {
                return res.status(400).json({
                    success: false,
                    message: 'Pooling is full.',
                });
            }

            pooling.participants.push({
                farmer: req.user._id,
                joinedAt: new Date(),
                farmSize: req.body.farmSize || 0,
            });

            pooling.currentParticipants += 1;

            // If pool is full, change status to confirmed
            if (pooling.currentParticipants >= pooling.targetParticipants) {
                pooling.status = 'confirmed';
            }

            await pooling.save();

            res.json({
                success: true,
                message: 'Successfully joined pooling.',
                data: pooling,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error joining pooling.',
                error: error.message,
            });
        }
    },

    // Update pooling status
    updateStatus: async (req, res) => {
        try {
            const { status, selectedMachinery } = req.body;

            const pooling = await MachineryPooling.findById(req.params.id);

            if (!pooling) {
                return res.status(404).json({
                    success: false,
                    message: 'Pooling not found.',
                });
            }

            // Check authorization
            if (pooling.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this pooling.',
                });
            }

            pooling.status = status;
            if (selectedMachinery) {
                pooling.selectedMachinery = selectedMachinery;
            }

            await pooling.save();

            res.json({
                success: true,
                message: 'Pooling updated successfully.',
                data: pooling,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating pooling.',
                error: error.message,
            });
        }
    },

    // Get user's pooling
    getUserPooling: async (req, res) => {
        try {
            const pooling = await MachineryPooling.find({
                $or: [{ createdBy: req.user._id }, { 'participants.farmer': req.user._id }],
            })
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
};

module.exports = poolingController;
