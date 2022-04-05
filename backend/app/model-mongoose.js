const mongoose = require("./db-mongoose");

const PayloadSchema = new mongoose.Schema({
    humidity: {type: Number, required: true},
    temperature: {type: Number, required: true},
    pressure: {type: Number, required: true},
    rainAnalog: {type: Number, required: true},
    rainDigital: {type: Number, required: true},
    city: {type: String, required: true},
});

//Model -> module.exports
module.exports = mongoose.model('Payload', PayloadSchema);