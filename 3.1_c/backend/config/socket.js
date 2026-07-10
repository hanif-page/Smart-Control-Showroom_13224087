// NEW for Frontend : Socket.IO setup + Redis keyspace listener
const { Server } = require('socket.io');
const { redisClient } = require('./redis');

let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('[Socket.IO] Dashboard client connected:', socket.id);
  });

  return io;
}

async function listenToRedisChanges() {
  const subscriber = redisClient.duplicate();
  await subscriber.connect();

  // Requirements: redis-cli config set notify-keyspace-events KEA
  await subscriber.pSubscribe('__keyevent@0__:set', (key) => {
    if (key.startsWith('device:')) {
      const deviceID = key.replace('device:', '');
      redisClient.get(key).then((raw) => {
        const state = JSON.parse(raw);
        io.emit('deviceStateChanged', { deviceID, state });
        console.log(`[Socket.IO] Pushed update for ${deviceID}:`, state);
      });
    }
  });
}

module.exports = { initSocket, listenToRedisChanges };