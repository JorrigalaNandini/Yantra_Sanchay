const Machinery = require('../models/Machinery');

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildTextFilter = (queryText) => {
    const regex = new RegExp(escapeRegex(queryText.trim()), 'i');
    return {
        $or: [
            { machineryName: regex },
            { description: regex },
            { brand: regex },
            { model: regex },
            { category: regex },
            { type: regex },
        ],
    };
};

const machineryController = {
    // Create new machinery
    create: async (req, res) => {
        try {
            const machineryData = {
                ...req.body,
                owner: req.user._id,
            };

            const machinery = new Machinery(machineryData);
            await machinery.save();

            res.status(201).json({
                success: true,
                message: 'Machinery added successfully.',
                data: machinery,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating machinery.',
                error: error.message,
            });
        }
    },

    // Get all machinery with filters
    getAll: async (req, res) => {
        try {
            const { category, district, crop, priceMin, priceMax, verified, q, search } = req.query;
            const filter = {};

            if (category) filter.category = category;
            if (district) filter['location.district'] = new RegExp(escapeRegex(district), 'i');
            if (crop) filter.suitableCrops = { $in: [crop] };
            if (verified === 'true') filter.verificationStatus = 'verified';
            if (priceMin || priceMax) {
                filter['pricing.price'] = {};
                if (priceMin) filter['pricing.price'].$gte = Number(priceMin);
                if (priceMax) filter['pricing.price'].$lte = Number(priceMax);
            }

            const queryText = q || search;
            if (queryText && String(queryText).trim()) {
                Object.assign(filter, buildTextFilter(queryText));
            }

            const machinery = await Machinery.find(filter).populate('owner', 'name phone profile.organizationName');

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

    // Get single machinery
    getById: async (req, res) => {
        try {
            const machinery = await Machinery.findById(req.params.id).populate(
                'owner',
                'name phone email profile.organizationName location'
            );

            if (!machinery) {
                return res.status(404).json({
                    success: false,
                    message: 'Machinery not found.',
                });
            }

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

    // Update machinery
    update: async (req, res) => {
        try {
            let machinery = await Machinery.findById(req.params.id);

            if (!machinery) {
                return res.status(404).json({
                    success: false,
                    message: 'Machinery not found.',
                });
            }

            // Check if user is the owner
            if (machinery.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this machinery.',
                });
            }

            machinery = await Machinery.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            res.json({
                success: true,
                message: 'Machinery updated successfully.',
                data: machinery,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating machinery.',
                error: error.message,
            });
        }
    },

    // Delete machinery
    delete: async (req, res) => {
        try {
            const machinery = await Machinery.findById(req.params.id);

            if (!machinery) {
                return res.status(404).json({
                    success: false,
                    message: 'Machinery not found.',
                });
            }

            if (machinery.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this machinery.',
                });
            }

            await Machinery.findByIdAndDelete(req.params.id);

            res.json({
                success: true,
                message: 'Machinery deleted successfully.',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting machinery.',
                error: error.message,
            });
        }
    },

    // Search machinery by text
    search: async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query required.',
                });
            }

            let machinery;

            try {
                machinery = await Machinery.find(
                    { $text: { $search: q } },
                    { score: { $meta: 'textScore' } }
                )
                    .sort({ score: { $meta: 'textScore' } })
                    .populate('owner', 'name phone');
            } catch (textSearchError) {
                machinery = [];
            }

            if (!machinery.length) {
                machinery = await Machinery.find(buildTextFilter(q)).populate('owner', 'name phone');
            }

            res.json({
                success: true,
                data: machinery,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error searching machinery.',
                error: error.message,
            });
        }
    },

    // Get user's machinery
    getUserMachinery: async (req, res) => {
        try {
            const machinery = await Machinery.find({ owner: req.user._id });

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
};

module.exports = machineryController;
