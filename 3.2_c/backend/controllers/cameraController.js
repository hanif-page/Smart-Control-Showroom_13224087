const Camera = require("../models/cameraModel");

async function getAllCameras(req, res) {
    const cameras = await Camera.find({});
    res.json({ cameras });
}

module.exports = { getAllCameras };