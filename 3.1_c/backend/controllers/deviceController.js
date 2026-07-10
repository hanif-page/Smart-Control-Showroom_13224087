// this file handles request/response only!
const { routeCommand } = require('../services/commandRouter');
// added to support the usage of React Frontend
const Device = require('../models/deviceCompleteModel');
const { getDeviceState } = require('../models/deviceStateModel');

async function sendCommand(req, res) {
    const { deviceID, command } = req.body;

    try {
        const result = await routeCommand(deviceID, command);
        res.json(result);
    } catch (err) {
        console.error('[sendCommand] Error:', err); // for debugging
        res.status(400).json({ error: err.message });
    }
}

// added to support the usage of React Frontend
async function getAllDevices(req, res) {
  const devices = await Device.find({});
  const states = {};

  for (const device of devices) {
    states[device.deviceID] = (await getDeviceState(device.deviceID)) || {};
  }

  res.json({ devices, states });
}

module.exports = { sendCommand, getAllDevices };