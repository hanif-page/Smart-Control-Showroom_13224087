const mongoose = require("mongoose");

async function connectMongo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/smart_showroom');
        console.log('[MongoDB] Connected');
    } catch (err) {
        console.error('[MongoDB] Connection error: ', err.message);
    }
}

module.exports = connectMongo;