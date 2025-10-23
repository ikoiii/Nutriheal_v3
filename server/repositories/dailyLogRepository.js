const { pool } = require("../config/db");

async function createDailyLog(userId, logDate, energyLevel, stressLevel, sleepQuality, notes) {
  const query = `
    INSERT INTO daily_logs (user_id, log_date, energy_level, stress_level, sleep_quality, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [userId, logDate, energyLevel, stressLevel, sleepQuality, notes]);
  return result.insertId;
}

async function getDailyLogsByUserId(userId, limit = 7) {
  const query = `
    SELECT id, log_date, energy_level, stress_level, sleep_quality, notes
    FROM daily_logs
    WHERE user_id = ?
    ORDER BY log_date DESC
    LIMIT ?
  `;
  const [logs] = await pool.query(query, [userId, limit]);
  return logs;
}

module.exports = {
  createDailyLog,
  getDailyLogsByUserId,
};
