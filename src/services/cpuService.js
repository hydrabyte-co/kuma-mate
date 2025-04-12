const si = require('systeminformation');
const logger = require('../utils/logger');

const getCurrentCpuUsage = async () => {
  try {
    const cpu = await si.currentLoad();
    const cpuInfo = await si.cpu();
    return {
      usage: cpu.currentLoad,
      cores: cpuInfo.cores,
      speed: cpuInfo.speed // GHz
    };
  } catch (err) {
    logger.error('Error fetching CPU usage', err.message);
    throw err;
  }
};

module.exports = { getCurrentCpuUsage };