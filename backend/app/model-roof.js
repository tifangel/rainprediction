const mongoose = require("./db-mongoose");

const RoofSchema = new mongoose.Schema({
    status: {type: Number, required: true},
});

//Model -> module.exports
module.exports = mongoose.model('Roof', RoofSchema);