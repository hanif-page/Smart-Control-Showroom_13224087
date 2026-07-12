// NEW : MQTT Listener for Roomba (push-based, real-time)
const mqtt = require('mqtt');
const Device = require('../models/deviceCompleteModel');
const { setDeviceState, getDeviceState } = require('../models/deviceStateModel');

async function startMqttSubscriber() {
  const roombaDevices = await Device.find({ protocol: 'MQTT' });

  roombaDevices.forEach((device) => {
    // Replace with real dorita980 local connection using device.credentials
    console.log(`[MQTT Subscriber] Connecting to ${device.name} at ${device.localIP}`);

    const client = mqtt.connect(`mqtt://${device.localIP}`, {
      username: device.credentials.blid,
      password: device.credentials.password,
      rejectUnauthorized: false
    });

    client.on('connect', () => {
      console.log(`[MQTT Subscriber] Connected to ${device.name}`);
      client.subscribe('#');
    });

    client.on('message', async (topic, message) => {
      console.log(`[MQTT Subscriber] Message from ${device.name} on ${topic}`);
      const currentState = (await getDeviceState(device.deviceID)) || {};
      // Parse real Roomba payload structure here; simplified dummy mapping:
      const state = {
        power: currentState.power || 'off',
        status: currentState.status || 'idle'
      };
      await setDeviceState(device.deviceID, state);
    });

    client.on('error', (err) => {
      console.error(`[MQTT Subscriber] Error for ${device.name}:`, err.message);
    });
  });
}

module.exports = { startMqttSubscriber };