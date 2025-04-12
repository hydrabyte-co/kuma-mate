const formatTimestamp = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };
  
  const logger = {
    info: (message, ...params) => {
      console.log(`\x1b[32m[${formatTimestamp()}] INFO: ${message}\x1b[0m`);
      if (params.length > 0) {
        console.log(...params);
      }
    },
    warning: (message, ...params) => {
      console.log(`\x1b[33m[${formatTimestamp()}] WARNING: ${message}\x1b[0m`);
      if (params.length > 0) {
        console.log(...params);
      }
    },
    error: (message, ...params) => {
      console.error(`\x1b[31m[${formatTimestamp()}] ERROR: ${message}\x1b[0m`);
      if (params.length > 0) {
        console.log(...params);
      }
    }
  };
  
  module.exports = logger;