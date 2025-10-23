const dailyLogRepository = require("../repositories/dailyLogRepository");

async function getSleepEnergyCorrelation(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyLogs = await dailyLogRepository.getDailyLogsByUserId(userId, 30);

  // Filter logs to ensure they are within the last 30 days and format for chart
  const formattedData = dailyLogs
    .filter(log => new Date(log.log_date) >= thirtyDaysAgo)
    .map((log) => ({
      date: new Date(log.log_date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      }),
      sleep_quality: log.sleep_quality,
      energy_level: log.energy_level,
    }));

  return formattedData.reverse(); // Ensure data is in chronological order
}

module.exports = {
  getSleepEnergyCorrelation,
};