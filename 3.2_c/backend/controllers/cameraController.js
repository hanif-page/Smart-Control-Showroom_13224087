const Camera = require("../models/cameraModel");

async function getAllCameras(req, res) {
    const cameras = await Camera.find({});
    res.json({ cameras });
}

async function getCameraStream(req, res) {
    const camera = await Camera.findOne({ cameraID: req.params.cameraID });

    if(!camera) return res.status(404).json({ error: "Camera not found!" });

    res.json({
        name: camera.name,
        webrtcURL: `ws://localhost:1984/api/ws?src=${camera.go2rtcStreamKey}` // not used! just for previous setup
    })
}

module.exports = { getAllCameras, getCameraStream };