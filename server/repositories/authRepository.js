const { pool } = require("../config/db");

async function findUserByEmail(email) {
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return users[0];
}

async function createUser(name, email, hashedPassword) {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  await pool.query(query, [name, email, hashedPassword]);
}

module.exports = {
  findUserByEmail,
  createUser,
};
