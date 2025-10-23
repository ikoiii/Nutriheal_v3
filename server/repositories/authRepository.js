const { pool } = require("../config/db");

async function findUserByEmail(email) {
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return users[0];
}

async function getUserById(id) {
  const [users] = await pool.query("SELECT id, name, email, age, weight, height, daily_checkin_streak, last_checkin_date FROM users WHERE id = ?", [id]);
  return users[0];
}

async function updateUserStreak(id, dailyCheckinStreak, lastCheckinDate) {
  const query = "UPDATE users SET daily_checkin_streak = ?, last_checkin_date = ? WHERE id = ?";
  await pool.query(query, [dailyCheckinStreak, lastCheckinDate, id]);
}

async function createUser(name, email, hashedPassword) {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  await pool.query(query, [name, email, hashedPassword]);
}

module.exports = {
  findUserByEmail,
  getUserById,
  updateUserStreak,
  createUser,
};
