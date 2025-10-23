const { pool } = require("../config/db");

async function createGoalProgress(goalId, progressDate, completed) {
  const query = `
    INSERT INTO goal_progress (goal_id, progress_date, completed)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(query, [goalId, progressDate, completed]);
  return result.insertId;
}

async function getGoalProgressByGoalId(goalId) {
  const query = `
    SELECT id, goal_id, progress_date, completed
    FROM goal_progress
    WHERE goal_id = ?
    ORDER BY progress_date ASC
  `;
  const [progress] = await pool.query(query, [goalId]);
  return progress;
}

module.exports = {
  createGoalProgress,
  getGoalProgressByGoalId,
};
