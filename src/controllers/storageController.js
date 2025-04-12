const storageService = require('../services/storageService');
const logger = require('../utils/logger');

const getStorageUsage = async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 90;
    const path = req.query.path || '/';

    logger.info(`Processing /storage-usage`, { threshold, path });

    const disk = await storageService.getStorageUsage(path);
    if (!disk) {
      logger.error(`Invalid mount point`, { path });
      return res.status(400).json({
        status: 'ERROR',
        message: `Mount point '${path}' not found`
      });
    }

    if (disk.usedPercent > threshold) {
      logger.warning(`Storage usage exceeded threshold`, { usedPercent: disk.usedPercent, threshold, path });
      return res.status(500).json({
        status: 'ALARM',
        usedPercent: disk.usedPercent.toFixed(2),
        usedGB: disk.usedGB,
        totalGB: disk.totalGB,
        mountPoint: disk.mount,
        message: `Storage usage (${disk.usedPercent.toFixed(2)}%) at '${path}' exceeded ${threshold}%`
      });
    }

    res.status(200).json({
      status: 'OK',
      usedPercent: disk.usedPercent.toFixed(2),
      usedGB: disk.usedGB,
      totalGB: disk.totalGB,
      mountPoint: disk.mount
    });
  } catch (err) {
    logger.error('Error processing /storage-usage', err.message);
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = { getStorageUsage };