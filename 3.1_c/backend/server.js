const express = require("express");
const connectMongo = require("./config/mongo");
const { connectRedis } = require("./config/redis");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();
app.use(express.json());
app.use('/api/devices', deviceRoutes);

const PORT = 3000;

async function start() {
    await connectMongo();
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

start();