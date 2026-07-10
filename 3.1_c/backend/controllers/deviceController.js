// this file handles request/response only!

const { routeCommand } = require('../services/commandRouter');

async function sendCommand(req, res) {
    const { deviceID, command } = req.body;

    try {
        const result = await routeCommand(deviceID, command);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { sendCommand };