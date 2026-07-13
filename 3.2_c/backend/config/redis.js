const { createClient } = require("redis");

const redisClient = createClient({ url: `${process.env.REDIS_URL}` });

redisClient.on('error', (err) => {
    console.error("[Redis] Error: ", err);
});

async function connectRedis() {
    await redisClient.connect();
    
    // NEW : Programmatically enable Keyspace Notifications for Set events
    // Replaces the need to manually run "redis-cli config set notify-keyspace-events KEA"
    await redisClient.configSet('notify-keyspace-events', 'KEA');

    console.log("[Redis] Connected and Keyspace Events Enabled");
}

module.exports = { redisClient, connectRedis };