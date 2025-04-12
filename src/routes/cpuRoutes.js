const express = require('express');
const router = express.Router();
const cpuController = require('../controllers/cpuController');

router.get('/cpu-usage', cpuController.getCpuUsage);

module.exports = router;