const { addGoal, getGoals, updateGoalStatus, addGoalProgress, getGoalProgress, UserGoalError } = require('../services/userGoalService');

const createGoal = async (req, res, next) => {
  try {
    const { goal_description } = req.body;
    const userId = req.user.id;

    const result = await addGoal(userId, goal_description);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await getGoals(userId);
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params; // goal ID
    const { status } = req.body;

    const result = await updateGoalStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addGoalProgressEntry = async (req, res, next) => {
  try {
    const { goal_id } = req.params; // goal ID
    const { progress_date, completed } = req.body;

    const result = await addGoalProgress(goal_id, progress_date, completed);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getGoalProgressHistory = async (req, res, next) => {
  try {
    const { goal_id } = req.params; // goal ID
    const progress = await getGoalProgress(goal_id);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getUserGoals,
  updateGoal,
  addGoalProgressEntry,
  getGoalProgressHistory,
};
