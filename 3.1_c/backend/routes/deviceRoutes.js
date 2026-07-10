const express = require("express");
const router = express.Router();
const { sendCommand, getAllDevices } = require("../controllers/deviceController");

// added to support the usage of React Frontend
router.get('/', getAllDevices);

router.post('/command', sendCommand);

module.exports = router;