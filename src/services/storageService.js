const si = require('systeminformation');
const logger = require('../utils/logger');

const getStorageUsage = async (path) => {
try {
    const disks = await si.fsSize();
    let disk = disks.find(d => d.mount === path);

    // Trên macOS, nếu path là '/', lấy container chính và tổng hợp used
    if (process.platform === 'darwin' && path === '/') {
    const dataDisk = disks.find(d => d.mount === '/System/Volumes/Data');
    if (dataDisk) {
        // Lấy container size từ /, tổng hợp used từ các volume chính
        const totalUsed = (disk ? disk.used : 0) + (dataDisk.used || 0);
        disk = {
        used: totalUsed,
        size: disk ? disk.size : dataDisk.size, // Container size, không cộng
        mount: path
        };
    }
    }

    if (disk) {
    return {
        usedPercent: (disk.used / disk.size) * 100,
        usedGB: (disk.used / 1024 / 1024 / 1024).toFixed(2),
        totalGB: (disk.size / 1024 / 1024 / 1024).toFixed(2),
        mount: disk.mount
    };
    }
    return null;
} catch (err) {
    logger.error('Error fetching storage usage', err.message);
    throw err;
}
};

module.exports = { getStorageUsage };