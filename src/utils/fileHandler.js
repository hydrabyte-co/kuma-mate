const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

const RESOURCE_FILE = path.join(__dirname, '../../data/resource-usage.json');
const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

const readResourceUsage = async () => {
  try {
    logger.info('Reading resource usage file');
    const data = await fs.readFile(RESOURCE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    logger.warning('Failed to read resource file, returning empty data', err.message);
    return { samples: [] };
  }
};

const writeResourceUsage = async (sample) => {
  try {
    logger.info('Writing resource usage sample', { timestamp: sample.timestamp });
    const data = await readResourceUsage();
    data.samples.push(sample);
    // Xóa mẫu cũ hơn 10 phút
    data.samples = data.samples.filter(s => s.timestamp >= Date.now() - MAX_AGE_MS);
    await fs.writeFile(RESOURCE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error('Error writing resource usage', err.message);
  }
};

module.exports = { readResourceUsage, writeResourceUsage };