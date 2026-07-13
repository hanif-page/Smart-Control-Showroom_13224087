const mqtt = require("mqtt");
const Device = require("../models/deviceCompleteModel");
// New : This will receives SwitchBot Cloud webhook pushes (optional, push-based)
const { setDeviceState } = require('../models/deviceStateModel');

async function handleSwitchBotWebhook(req, res) {
  const { deviceID, power } = req.body; // adapt to SwitchBot's actual webhook payload shape

  console.log(`[Webhook] Received push update for ${deviceID}: power=${power}`);
  await setDeviceState(deviceID, { power });

  res.status(200).json({ received: true });
}

// NEW : Endpoint to simulate hardware pushing its state (either Webhook/MQTT)
async function simulatePhysicalPush(req, res) {
  const { deviceID, state } = req.body; 

  const device = await Device.findOne({ deviceID });

  if (device && device.protocol === 'MQTT') {
    console.log(`[Hardware Simulator] Acting as Roomba. Publishing MQTT payload...`);
    
    // Connect to the same broker as the subscriber and PUBLISH the new state
    const client = mqtt.connect(`mqtt://${device.localIP}`);
    
    client.on('connect', () => {
      const topic = `nakayama/roomba/${device.deviceID}/state`

      // Publish the JSON state to a dummy topic
      client.publish(topic, JSON.stringify(state));
      client.end(); 
    });

    return res.status(200).json({ success: true, simulated: 'mqtt_published' });
  }
  
  await setDeviceState(deviceID, state);
  res.status(200).json({ success: true, simulated: true });
  console.log(`[Webhook/MQTT] Device ${deviceID} physically pushed new state:`, state);
}

module.exports = { handleSwitchBotWebhook, simulatePhysicalPush };