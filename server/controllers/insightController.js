const insightService = require("../services/insightService");

async function getSleepEnergyCorrelationController(req, res, next) {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const data = await insightService.getSleepEnergyCorrelation(userId);
    res.json(data);
  } catch (error) {
    console.error("Error in getSleepEnergyCorrelationController:", error);
    next(error); 
  }
}

module.exports = {
  getSleepEnergyCorrelationController,
};