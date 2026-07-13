require("dotenv").config();

const express = require("express");
const connectMongo = require("./config/mongo");
const { connectRedis } = require("./config/redis");
const deviceRoutes = require("./routes/deviceRoutes");

// added to support the usage of React Frontend
const http = require('http');
const cors = require('cors');
const { initSocket, listenToRedisChanges } = require('./config/socket');
const { startPolling } = require('./services/statePoller');
const { startMqttSubscriber } = require('./services/mqttSubscriber');
const webhookRoutes = require('./routes/webhookRoutes');

const cameraRoutes = require('./routes/cameraRoutes'); // added to support the camera setup

// added to support the usage of React Frontend
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/devices', deviceRoutes);
app.use('/api/webhooks', webhookRoutes); // not directly use, but it's in case it's needed just for getting a POST request to change device state from the physical device later... 
app.use('/api/cctv', cameraRoutes);
const server = http.createServer(app);

const PORT = 3000;

async function start() {
    await connectMongo();
    await connectRedis();

    // added to support the usage of React Frontend
    initSocket(server);
    await listenToRedisChanges();

    // commented the startPolling because I have implemented the active-push changes inititiative from each of the Physical Device Representation
    // startPolling();
    
    await startMqttSubscriber();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
    
}

start();