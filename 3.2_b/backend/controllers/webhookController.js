// New : This will receives SwitchBot Cloud webhook pushes (optional, push-based)
const { setDeviceState } = require('../models/deviceStateModel');

async function handleSwitchBotWebhook(req, res) {
  const { deviceID, power } = req.body; // adapt to SwitchBot's actual webhook payload shape

  console.log(`[Webhook] Received push update for ${deviceID}: power=${power}`);
  await setDeviceState(deviceID, { power });

  res.status(200).json({ received: true });
}

module.exports = { handleSwitchBotWebhook };