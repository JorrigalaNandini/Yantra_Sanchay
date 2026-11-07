const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, phone, role, location } = req.body;

        if (!name || !phone || !role || !location) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, role and location are required"
            });
        }

        const user = new User({
            name,
            phone,
            role,
            location
        });

        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            message: "User saved successfully",
            user: savedUser
        });

    } catch (error) {
        console.error("Error saving user:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save user",
            error: error.message
        });
    }
});

module.exports = router;