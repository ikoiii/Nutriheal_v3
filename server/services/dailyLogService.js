const dailyLogRepository = require('../repositories/dailyLogRepository');
const { getUserById, updateUserStreak } = require('../repositories/authRepository');

class DailyLogError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'DailyLogError';
    this.statusCode = statusCode;
  }
}

async function addDailyLog(userId, logDate, energyLevel, stressLevel, sleepQuality, notes) {
  if (!userId || !logDate || !energyLevel || !stressLevel || !sleepQuality) {
    throw new DailyLogError('Semua kolom wajib diisi kecuali catatan.', 400);
  }

  // Basic validation for slider values (1-5)
  if (energyLevel < 1 || energyLevel > 5 || stressLevel < 1 || stressLevel > 5 || sleepQuality < 1 || sleepQuality > 5) {
    throw new DailyLogError('Tingkat energi, stres, dan kualitas tidur harus antara 1 dan 5.', 400);
  }

  const logId = await dailyLogRepository.createDailyLog(userId, logDate, energyLevel, stressLevel, sleepQuality, notes);

  // Streak Logic
  const user = await getUserById(userId);
  let currentStreak = user.daily_checkin_streak || 0;
  let lastCheckin = user.last_checkin_date ? new Date(user.last_checkin_date) : null;

  const today = new Date(logDate);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Format dates to YYYY-MM-DD for comparison
  const todayFormatted = today.toISOString().split('T')[0];
  const yesterdayFormatted = yesterday.toISOString().split('T')[0];
  const lastCheckinFormatted = lastCheckin ? lastCheckin.toISOString().split('T')[0] : null;

  if (lastCheckinFormatted === todayFormatted) {
    // Already checked in today, do nothing to streak
  } else if (lastCheckinFormatted === yesterdayFormatted) {
    // Checked in yesterday, increment streak
    currentStreak++;
  } else {
    // Not checked in yesterday or before, reset streak
    currentStreak = 1;
  }

  await updateUserStreak(userId, currentStreak, todayFormatted);

  return { message: 'Log harian berhasil ditambahkan!', logId, currentStreak };
}

async function getDailyLogs(userId, limit) {
  if (!userId) {
    throw new DailyLogError('User ID diperlukan untuk mengambil log harian.', 400);
  }
  const logs = await dailyLogRepository.getDailyLogsByUserId(userId, limit);
  return logs;
}

module.exports = {
  addDailyLog,
  getDailyLogs,
  DailyLogError,
};
