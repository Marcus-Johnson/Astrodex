const express = require('express');
const { simulateRocket } = require('../controllers/simulation.controller');

const router = express.Router();

router.post('/run', simulateRocket);

module.exports = router;