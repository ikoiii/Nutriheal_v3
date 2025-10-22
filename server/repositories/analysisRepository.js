const { pool } = require("../config/db");

async function saveAnalysisRecord(userId, fileName, analysisResult) {
  const query = "INSERT INTO medical_analyses (user_id, file_name, analysis_summary) VALUES (?, ?, ?)";
  await pool.query(query, [userId, fileName, JSON.stringify(analysisResult)]);
}

async function getAnalysisHistory(userId) {
  const query = `
    SELECT id, file_name, analysis_summary, created_at
    FROM medical_analyses
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  const [history] = await pool.query(query, [userId]);
  return history.map((item) => ({
    ...item,
    analysis_summary: JSON.parse(item.analysis_summary),
  }));
}

module.exports = {
  saveAnalysisRecord,
  getAnalysisHistory,
};
