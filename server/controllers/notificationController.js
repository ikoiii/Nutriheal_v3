const notificationService = require("../services/notificationService");
const { webpush, vapidKeys } = require("../config/webPushConfig");

async function subscribe(req, res, next) {
  try {
    // Assuming userId is available from authentication middleware (e.g., req.user.id)
    const userId = req.user.id; // IMPORTANT: Ensure req.user is populated by authMiddleware
    const subscription = req.body; // Push subscription object from frontend

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found." });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ message: "Bad Request: Invalid subscription object." });
    }

    const result = await notificationService.saveSubscription(userId, subscription);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving subscription:", error);
    next(error); // Pass error to the error handling middleware
  }
}

async function getVapidPublicKey(req, res) {
  try {
    const publicKey = vapidKeys.publicKey;
    res.status(200).json({ publicKey });
  } catch (error) {
    console.error("Error getting VAPID public key:", error);
    res.status(500).json({ message: "Failed to get VAPID public key." });
  }
}

module.exports = {
  subscribe,
  getVapidPublicKey,
};
