const axios = require("axios");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const machineryRoutes = require("./routes/machineryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// =========================================
// CONNECT TO MONGODB
// =========================================
connectDB();

// =========================================
// MIDDLEWARE
// =========================================
app.use(cors());
app.use(express.json());

// =========================================
// ROUTES
// =========================================

// Machinery routes
app.use("/api/machinery", machineryRoutes);

// User routes
app.use("/api/users", userRoutes);

// =========================================
// TEST ROUTE
// =========================================
app.get("/", (req, res) => {
    res.json({
        message: "Yantra Sanchay Backend is running 🚜"
    });
});

// =========================================
// TRANSLATION API
// =========================================
app.post("/api/translate", async (req, res) => {
    try {
        const { text, source, target } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "Text is required"
            });
        }

        const response = await axios.post(
            "http://127.0.0.1:8000/translate",
            {
                text: text,
                source: source || "tel_Telu",
                target: target || "eng_Latn"
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error("Translation service error:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({
            success: false,
            error: "Translation service unavailable"
        });
    }
});

// =========================================
// SERVER
// =========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});