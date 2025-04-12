const express = require('express');
const cpuRoutes = require('./routes/cpuRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const storageRoutes = require('./routes/storageRoutes');

const app = express();

app.use(express.json());
app.use(cpuRoutes);
app.use(memoryRoutes);
app.use(storageRoutes);

module.exports = app;