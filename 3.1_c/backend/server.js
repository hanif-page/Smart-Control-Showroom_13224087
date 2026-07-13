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

// added to support the usage of React Frontend
const app = express();
app.use(cors()); // This line Enable CORS for all incoming Express HTTP requests (fixing the CORS problem)
app.use(express.json());
app.use('/api/devices', deviceRoutes);
app.use('/api/webhooks', webhookRoutes);
const server = http.createServer(app);

const PORT = 3000;

async function start() {
    await connectMongo();
    await connectRedis();

    // added to support the usage of React Frontend
    initSocket(server);
    await listenToRedisChanges();
    // startPolling();
    await startMqttSubscriber();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
    
}

start();