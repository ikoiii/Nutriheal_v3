const { addDailyLog, getDailyLogs, DailyLogError } = require('../services/dailyLogService');

const createDailyLogEntry = async (req, res, next) => {
  try {
    const { log_date, energy_level, stress_level, sleep_quality, notes } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    const result = await addDailyLog(
      userId,
      log_date,
      energy_level,
      stress_level,
      sleep_quality,
      notes
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getDailyLogsHistory = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const { limit } = req.query; // Optional limit for number of logs

    const logs = await getDailyLogs(userId, limit);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDailyLogEntry,
  getDailyLogsHistory,
};
