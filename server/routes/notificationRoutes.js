const express = require("express");
const { subscribe, getVapidPublicKey } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware"); // Assuming authMiddleware has a protect function
const router = express.Router();

// Route to subscribe for push notifications
// This route should be protected to ensure only authenticated users can subscribe
router.post("/subscribe", protect, subscribe);

// Route to get VAPID public key
router.get("/vapid-public-key", getVapidPublicKey);

module.exports = router;
