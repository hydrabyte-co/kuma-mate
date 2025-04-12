const memoryService = require('../services/memoryService');
const logger = require('../utils/logger');

const getMemoryUsage = async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 80;

    logger.info(`Processing /memory-usage`, { threshold });

    const memData = await memoryService.getMemoryUsage();

    if (memData.usedPercent > threshold) {
      logger.warning(`Memory usage exceeded threshold`, { usedPercent: memData.usedPercent, threshold });
      return res.status(500).json({
        status: 'ALARM',
        usedPercent: memData.usedPercent.toFixed(2),
        usedGB: memData.usedGB,
        totalGB: memData.totalGB,
        message: `Memory usage (${memData.usedPercent.toFixed(2)}%) exceeded ${threshold}%`
      });
    }

    res.status(200).json({
      status: 'OK',
      usedPercent: memData.usedPercent.toFixed(2),
      usedGB: memData.usedGB,
      totalGB: memData.totalGB
    });
  } catch (err) {
    logger.error('Error processing /memory-usage', err.message);
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = { getMemoryUsage };