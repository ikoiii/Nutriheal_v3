const express = require("express");
const { getSleepEnergyCorrelationController } = require("../controllers/insightController");
const router = express.Router();

// In a real application, authentication middleware would be applied here
router.get("/sleep-energy/:userId", getSleepEnergyCorrelationController);

module.exports = router;