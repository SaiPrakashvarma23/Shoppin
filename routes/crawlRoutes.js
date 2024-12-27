const express = require('express');
const { crawlDomains } = require('../controllers/crawlController');
const router = express.Router();

router.post('/', crawlDomains);

module.exports = router;
