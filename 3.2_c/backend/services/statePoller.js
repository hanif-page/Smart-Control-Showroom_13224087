// NEW : For background polling for Cloud API / Local API devices
const Device = require('../models/deviceCompleteModel');
const { setDeviceState, getDeviceState } = require('../models/deviceStateModel');

async function fetchSwitchBotState(device, currentState) {
  console.log(`[Poller] Polling SwitchBot Cloud API for ${device.name}`);
  // const power = Math.random() > 0.9 ? (currentState.power === 'on' ? 'off' : 'on') : (currentState.power || 'off'); // this is just for simulation purpose!
  const power = currentState.power || 'off';
  return { power };
}

async function fetchNatureRemoState(device, currentState) {
  console.log(`[Poller] Polling Nature Remo Local API for ${device.name}`);
  return {
    power: currentState.power || 'off'
    // temp: currentState.temp || 24
  };
}

async function pollCloudAPIDevices() {
  const devices = await Device.find({ protocol: 'CloudAPI' });
  for (const device of devices) {
    const currentState = (await getDeviceState(device.deviceID)) || {};
    const state = await fetchSwitchBotState(device, currentState);
    await setDeviceState(device.deviceID, state);
  }
}

async function pollLocalAPIDevices() {
  const devices = await Device.find({ protocol: 'LocalAPI' });
  for (const device of devices) {
    const currentState = (await getDeviceState(device.deviceID)) || {};
    const state = await fetchNatureRemoState(device, currentState);
    await setDeviceState(device.deviceID, state);
  }
}

function startPolling() {
  setInterval(pollCloudAPIDevices, 60 * 1000); // Cloud API: 60s 
  setInterval(pollLocalAPIDevices, 15 * 1000); // Local API: 15s
  console.log('[Poller] Background polling started (CloudAPI: 60s, LocalAPI: 15s)');
}

module.exports = { startPolling };