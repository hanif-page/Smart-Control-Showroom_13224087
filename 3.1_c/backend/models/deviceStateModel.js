// for the device state, for quick access, I proposed use Redis DB

const { redisClient } = require("../config/redis");

async function setDeviceState(deviceID, state) {
    const payload = { ...state, updatedAt: new Date().toISOString() };
    await redisClient.set(`device:${deviceID}`, JSON.stringify(payload));
    return payload;
}

async function getDeviceState(deviceID) {
    const raw = await redisClient.get(`device:${deviceID}`);
    return raw ? JSON.parse(raw) : null;
}

module.exports = { setDeviceState, getDeviceState };