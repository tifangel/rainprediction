const mongoose = require("./db-mongoose");

const RoofSchema = new mongoose.Schema({
    status: {type: String, required: true},
    city: {type: String, required: true},
});

//Model -> module.exports
module.exports = mongoose.model('Roof', RoofSchema);