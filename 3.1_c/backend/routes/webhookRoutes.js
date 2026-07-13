// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { handleSwitchBotWebhook, simulatePhysicalPush } = require('../controllers/webhookController');

router.post('/switchbot', handleSwitchBotWebhook);
router.post('/simulate', simulatePhysicalPush);

module.exports = router;