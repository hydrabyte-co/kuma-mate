const app = require('./src/app');
// Include resourceCollector để bắt đầu thu thập mẫu
require('./src/utils/resourceCollector');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`KumaMate running at http://localhost:${PORT}`);
});