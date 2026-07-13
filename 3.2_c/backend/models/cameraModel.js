const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
    cameraID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    rtspURL: {
        type: String,
        required: true
    },
    go2rtcStreamKey: {
        type: String,
        required: true
    }
}); 

module.exports = mongoose.model('Camera', cameraSchema);