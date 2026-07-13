const express = require("express");
const router = express.Router();
const { getAllCameras, getCameraStream } = require("../controllers/cameraController");

router.get('/', getAllCameras);
router.get('/:cameraID/stream', getCameraStream);

module.exports = router;