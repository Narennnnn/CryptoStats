const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

router.get('/stats', cryptoController.getStats.bind(cryptoController));
router.get('/deviation', cryptoController.getDeviation.bind(cryptoController));

module.exports = router;
