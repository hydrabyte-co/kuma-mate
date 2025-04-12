const si = require('systeminformation');
const logger = require('../../utils/logger');

const getMemoryUsage = async () => {
  try {
    const mem = await si.mem();
    return {
      usedPercent: ((mem.total - mem.available) / mem.total) * 100, // Dùng available thay vì used
      usedGB: ((mem.total - mem.available) / 1024 / 1024 / 1024).toFixed(2),
      totalGB: (mem.total / 1024 / 1024 / 1024).toFixed(2)
    };
  } catch (err) {
    logger.error('Error fetching memory usage', err.message);
    throw err;
  }
};

module.exports = { getMemoryUsage };