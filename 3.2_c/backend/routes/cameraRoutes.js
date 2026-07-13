const express = require("express");
const router = express.Router();
const { getAllCameras } = require("../controllers/cameraController");

router.get('/', getAllCameras);

module.exports = router;