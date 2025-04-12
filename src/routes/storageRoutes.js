const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');

router.get('/storage-usage', storageController.getStorageUsage);

module.exports = router;