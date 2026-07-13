const express = require('express');
const router = express.Router();
const { handleSwitchBotWebhook, simulatePhysicalPush } = require('../controllers/webhookController');

// router.post('/switchbot', handleSwitchBotWebhook); // disabling this, because the Webhook work in simulation already runs in below /simulate POST request
router.post('/simulate', simulatePhysicalPush);

module.exports = router;