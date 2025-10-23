const { pool } = require("../config/db");

async function createUserGoal(userId, goalDescription, status = 'active') {
  const query = `
    INSERT INTO user_goals (user_id, goal_description, status)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(query, [userId, goalDescription, status]);
  return result.insertId;
}

async function getUserGoalsByUserId(userId) {
  const query = `
    SELECT id, goal_description, status, created_at
    FROM user_goals
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  const [goals] = await pool.query(query, [userId]);
  return goals;
}

async function updateUserGoalStatus(goalId, status) {
  const query = `
    UPDATE user_goals
    SET status = ?
    WHERE id = ?
  `;
  const [result] = await pool.query(query, [status, goalId]);
  return result.affectedRows;
}

module.exports = {
  createUserGoal,
  getUserGoalsByUserId,
  updateUserGoalStatus,
};
