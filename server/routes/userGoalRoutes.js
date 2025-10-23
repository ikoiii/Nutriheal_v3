const express = require('express');
const router = express.Router();
const { createGoal, getUserGoals, updateGoal, addGoalProgressEntry, getGoalProgressHistory } = require('../controllers/userGoalController');
const { protect } = require('../middleware/authMiddleware');

// Protect all user goal routes with authentication middleware
router.post('/', protect, createGoal);
router.get('/', protect, getUserGoals);
router.put('/:id', protect, updateGoal);
router.post('/:goal_id/progress', protect, addGoalProgressEntry);
router.get('/:goal_id/progress', protect, getGoalProgressHistory);

module.exports = router;
