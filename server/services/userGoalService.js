const userGoalRepository = require('../repositories/userGoalRepository');
const goalProgressRepository = require('../repositories/goalProgressRepository');

class UserGoalError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'UserGoalError';
    this.statusCode = statusCode;
  }
}

async function addGoal(userId, goalDescription) {
  if (!userId || !goalDescription) {
    throw new UserGoalError('User ID dan deskripsi tujuan harus diisi.', 400);
  }
  const goalId = await userGoalRepository.createUserGoal(userId, goalDescription);
  return { message: 'Tujuan berhasil ditambahkan!', goalId };
}

async function getGoals(userId) {
  if (!userId) {
    throw new UserGoalError('User ID diperlukan untuk mengambil tujuan.', 400);
  }
  const goals = await userGoalRepository.getUserGoalsByUserId(userId);
  return goals;
}

async function updateGoalStatus(goalId, status) {
  if (!goalId || !status) {
    throw new UserGoalError('ID tujuan dan status harus diisi.', 400);
  }
  if (!['active', 'completed'].includes(status)) {
    throw new UserGoalError(`Status tidak valid. Harus 'active' atau 'completed'.`, 400);
  }
  const affectedRows = await userGoalRepository.updateUserGoalStatus(goalId, status);
  if (affectedRows === 0) {
    throw new UserGoalError('Tujuan tidak ditemukan atau status sama.', 404);
  }
  return { message: 'Status tujuan berhasil diperbarui!' };
}

async function addGoalProgress(goalId, progressDate, completed) {
  if (!goalId || !progressDate || typeof completed !== 'boolean') {
    throw new UserGoalError('ID tujuan, tanggal progres, dan status selesai harus diisi.', 400);
  }
  const progressId = await goalProgressRepository.createGoalProgress(goalId, progressDate, completed);
  return { message: 'Progres tujuan berhasil ditambahkan!', progressId };
}

async function getGoalProgress(goalId) {
  if (!goalId) {
    throw new UserGoalError('ID tujuan diperlukan untuk mengambil progres.', 400);
  }
  const progress = await goalProgressRepository.getGoalProgressByGoalId(goalId);
  return progress;
}

module.exports = {
  addGoal,
  getGoals,
  updateGoalStatus,
  addGoalProgress,
  getGoalProgress,
  UserGoalError,
};
