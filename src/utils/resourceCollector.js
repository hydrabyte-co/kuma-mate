const fileHandler = require('./fileHandler');
const cpuService = require('../services/cpuService');
const memoryService = require('../services/memoryService');
const storageService = require('../services/storageService');
const logger = require('./logger');

// Thu thập mẫu mỗi 30s
setInterval(async () => {
  try {
    const cpuData = await cpuService.getCurrentCpuUsage();
    const memoryData = await memoryService.getMemoryUsage();
    const storageData = await storageService.getStorageUsage('/');

    const sample = {
      timestamp: Date.now(),
      cpu: cpuData.usage,
      memory: memoryData.usedPercent,
      storage: storageData ? storageData.usedPercent : null
    };

    logger.info('Collected resource sample', sample);
    await fileHandler.writeResourceUsage(sample);
  } catch (err) {
    logger.error('Error collecting resource sample', err.message);
  }
}, 30 * 1000);