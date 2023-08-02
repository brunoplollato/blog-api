// routes/userRoutes.js
const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController');

const router = express.Router();

// Register
router.get('/healthCheck', healthCheck);

// Get all users

module.exports = router;
