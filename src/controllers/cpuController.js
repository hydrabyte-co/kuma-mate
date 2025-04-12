const cpuService = require('../services/cpuService');
const fileHandler = require('../utils/fileHandler');
const logger = require('../utils/logger');

const getCpuUsage = async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 75;
    const duration = parseInt(req.query.duration) || 60;

    logger.info(`Processing /cpu-usage`, { threshold, duration });

    // Đọc dữ liệu từ JSON
    const data = await fileHandler.readResourceUsage();
    const recentSamples = data.samples
      .filter(s => s.timestamp >= Date.now() - duration * 1000)
      .map(s => s.cpu);

    const avgUsage = recentSamples.length
      ? recentSamples.reduce((sum, val) => sum + val, 0) / recentSamples.length
      : 0;
    const cpuData = await cpuService.getCurrentCpuUsage();

    if (avgUsage > threshold) {
      logger.warning(`CPU usage exceeded threshold`, { avgUsage, threshold, duration });
      return res.status(500).json({
        status: 'ALARM',
        currentUsage: cpuData.usage.toFixed(2),
        avgUsage: avgUsage.toFixed(2),
        cores: cpuData.cores,
        speedGHz: cpuData.speed,
        message: `CPU usage (${avgUsage.toFixed(2)}%) exceeded ${threshold}% in last ${duration}s`
      });
    }

    res.status(200).json({
      status: 'OK',
      currentUsage: cpuData.usage.toFixed(2),
      avgUsage: avgUsage.toFixed(2),
      cores: cpuData.cores,
      speedGHz: cpuData.speed
    });
  } catch (err) {
    logger.error('Error processing /cpu-usage', err.message);
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = { getCpuUsage };