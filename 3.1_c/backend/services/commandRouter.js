// based on the report document, I'm proposing using the Facade Design Pattern. This file works as the Facade!

const Device = require('../models/deviceCompleteModel');
const { setDeviceState, getDeviceState } = require('../models/deviceStateModel');
const switchBotAdapter = require('../adapters/switchBotAdapter');
const natureRemoAdapter = require('../adapters/natureRemoAdapter');
const roombaAdapter = require('../adapters/roombaAdapter');

const adapters = {
  CloudAPI: switchBotAdapter,
  LocalAPI: natureRemoAdapter,
  MQTT: roombaAdapter
};

async function routeCommand(deviceID, command){
    const device = await Device.findOne({ deviceID });
    if (!device) throw new Error(`Device ${deviceID} not found in the Database!`);

    const adapter = adapters[device.protocol] // using the correct adapter based on the device protocol
    if (!adapter) throw new Error(`No adapter available for protocol ${device.protocol}`);

    // added to support the usage of React Frontend
    const currentState = (await getDeviceState(deviceID)) || {};
 
    console.log(`\n[Command Router] Routing "${command}" for "${device.name}" via ${device.protocol}`);

    const result = await adapter.execute(device, command, currentState);

    if (result.success){
        const savedState = await setDeviceState(deviceID, result.newState);
        console.log(`[Command Router] State written to Redis: `, savedState);
    }

    return result;
}

module.exports = { routeCommand };