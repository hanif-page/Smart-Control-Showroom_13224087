// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { handleSwitchBotWebhook } = require('../controllers/webhookController');

router.post('/switchbot', handleSwitchBotWebhook);

module.exports = router;