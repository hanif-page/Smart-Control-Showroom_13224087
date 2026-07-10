const express = require("express");
const router = express.Router();
const { sendCommand } = require("../controllers/deviceController");

router.post('/command', sendCommand);

module.exports = router;