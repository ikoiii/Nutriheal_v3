const notificationRepository = require("../repositories/notificationRepository");

async function saveSubscription(userId, subscription) {
  const { endpoint, keys } = subscription;
  const p256dhKey = keys.p256dh;
  const authKey = keys.auth;

  // Check if subscription already exists for this user and endpoint
  // (Optional: Implement logic to update existing subscription or prevent duplicates)

  const subscriptionId = await notificationRepository.createSubscription(userId, endpoint, p256dhKey, authKey);
  return { id: subscriptionId, message: "Subscription saved successfully." };
}

module.exports = {
  saveSubscription,
};
