// NEW : MQTT Listener for Roomba (push-based, real-time)
const mqtt = require('mqtt');
const Device = require('../models/deviceCompleteModel');
const { setDeviceState, getDeviceState } = require('../models/deviceStateModel');

async function startMqttSubscriber() {
  const roombaDevices = await Device.find({ protocol: 'MQTT' });

  roombaDevices.forEach((device) => {
    // In real implementation, this part needs to be replace with real dorita980 local connection using device.credentials
    console.log(`[MQTT Subscriber] Connecting to ${device.name} at ${device.localIP}`);

    const client = mqtt.connect(`mqtt://${device.localIP}`, {
      // username: device.credentials.blid,
      // password: device.credentials.password,
      rejectUnauthorized: false
    });

    // starting the listener
    client.on('connect', () => {
      console.log(`[MQTT Subscriber] Connected to ${device.name}`);

      const topic = `nakayama/roomba/${device.deviceID}/state`;
      client.subscribe(topic, (err) => {
        if(!err){
          console.log(`[MQTT Subscriber] Subscribed to ${topic}`);
        }
      });
    });

    client.on('message', async (topic, message) => {
      console.log(`[MQTT Subscriber] Message from ${device.name} on ${topic}`);
      
      // fetch old state to preserve fields that aren't changing right now
      const currentState = (await getDeviceState(device.deviceID)) || {};
      
      // parse the REAL message pushed by the physical device
      let payload = {};
      try {
          payload = JSON.parse(message.toString());
      } catch (err) {
          console.error(`[MQTT] Failed to parse message from ${device.name}:`, message.toString());
          return;
      }

      // prioritize the physical payload. Fallback to Redis Data if the payload is missing a field.
      const state = {
        ...currentState, // Keeps everything else (like battery level, location, etc.)
        power: payload.power !== undefined ? payload.power : (currentState.power || 'off'),
        status: payload.status !== undefined ? payload.status : (currentState.status || 'idle')
      };
      
      // 4. Save the true updated state to Redis
      await setDeviceState(device.deviceID, state);
    });

    client.on('error', (err) => {
      console.error(`[MQTT Subscriber] Error for ${device.name}:`, err.message);
    });
  });
}

module.exports = { startMqttSubscriber };