// seed.js, It's run once to insert dummy devices
const mongoose = require('mongoose');
const Device = require('./models/deviceCompleteModel');

async function populateDummyDataToDB() {
  await mongoose.connect('mongodb://localhost:27017/smart_showroom');

  await Device.deleteMany({});
  await Device.insertMany([
    {
      deviceID: "room_light01",
      name: "Room Light 01",
      type: "SwitchBot",
      protocol: "CloudAPI",
      credentials: { token: "dummy-switchbot-token" },
      glbObjectID: "mesh_light_meeting01"
    },
    {
      deviceID: "main_ac01",
      name: "Main AC 01",
      type: "NatureRemo",
      protocol: "LocalAPI",
      localIP: "192.168.1.50",
      credentials: { token: "dummy-remo-token" },
      glbObjectID: "mesh_ac_showroom01"
    },
    {
      deviceID: "roomba01",
      name: "Roomba Cleaner 01",
      type: "Roomba",
      protocol: "MQTT",
      localIP: "192.168.1.60",
      credentials: { blid: "dummy-blid", password: "dummy-password" },
      glbObjectID: "mesh_roomba01"
    }
  ]);

  console.log('[Seed] Dummy devices inserted');
  process.exit(0);
}

populateDummyDataToDB();