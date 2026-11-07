const express = require("express");

const router = express.Router();

const {
    getMachinery
} = require("../controllers/machineryController");

// GET all machinery
router.get("/", getMachinery);

module.exports = router;