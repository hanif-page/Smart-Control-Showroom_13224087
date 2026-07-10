// for the complete Model, I propose used MongoDB

// use mongoose, an Object Data Modelling (ODM) library for MongoDB and Node.js
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    deviceID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    type: { // "SwitchBot", "NatureRemo", "Roomba"
        type: String, 
        required: true,
    },
    protocol: { // "CloudAPI", "LocalAPI", "MQTT"
        type: String,
        required: true,
    },
    localIP: {
        type: String
    },
    credentials: {
        type: Object,
        default: {}
    },
    glbObjectID: { // maps to the 3D twin mesh name
        type: String 
    }
});

module.exports = mongoose.model('Device', deviceSchema);