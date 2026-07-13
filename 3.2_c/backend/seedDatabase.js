require('dotenv').config();

// seed.js, It's run once to insert dummy devices
const mongoose = require('mongoose');
const Device = require('./models/deviceCompleteModel');

async function populateDummyDataToDB() {
  await mongoose.connect(`${process.env.MONGO_URI}`);

  await Device.deleteMany({});
  await Device.insertMany([
    {
      deviceID: "main_light_01",
      name: "Main Light 01",
      type: "SwitchBot",
      protocol: "CloudAPI",
      credentials: { token: "dummy-switchbot-token" },
      glbObjectID: "Main_Light_01"
    },
    {
      deviceID: "main_tv_01",
      name: "Main TV 01",
      type: "NatureRemo",
      protocol: "LocalAPI",
      localIP: "192.168.1.50",
      credentials: { token: "dummy-remo-token" },
      glbObjectID: "Main_TV_01"
    },
    {
      deviceID: "main_roomba_01",
      name: "Main Roomba 01",
      type: "Roomba",
      protocol: "MQTT",
      // localIP: "192.168.1.60", 
      localIP: "broker.emqx.io", // public test brokers which allow free connection 
      credentials: { blid: "dummy-blid", password: "dummy-password" },
      glbObjectID: "Main_Roomba_01"
    }
  ]);

  console.log('[Seed] Dummy devices inserted');
  process.exit(0);
}

populateDummyDataToDB();