const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

router.get('/memory-usage', memoryController.getMemoryUsage);

module.exports = router;