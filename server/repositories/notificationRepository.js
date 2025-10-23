const { pool } = require("../config/db");

async function createSubscription(userId, endpoint, p256dhKey, authKey) {
  const query = `
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [userId, endpoint, p256dhKey, authKey]);
  return result.insertId;
}

module.exports = {
  createSubscription,
};
