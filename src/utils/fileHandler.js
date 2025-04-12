const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

const DATA_DIR = path.join(__dirname, '../data');
const RESOURCE_FILE = path.join(DATA_DIR, 'resource-usage.json');
const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

// Tạo thư mục và file nếu chưa có
const ensureDataFile = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch (err) {
    logger.info('Data directory not found, creating...', { path: DATA_DIR });
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(RESOURCE_FILE);
  } catch (err) {
    logger.info('Resource usage file not found, creating...', { path: RESOURCE_FILE });
    await fs.writeFile(RESOURCE_FILE, JSON.stringify({ samples: [] }, null, 2));
  }
};

const readResourceUsage = async () => {
  await ensureDataFile();
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
  await ensureDataFile();
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