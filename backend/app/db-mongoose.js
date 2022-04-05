const mongoose = require("mongoose");

const uri = "mongodb+srv://dbUser:dbUserPassword@dibi8.lcax6.mongodb.net/Rain?retryWrites=true&w=majority"

mongoose.connect(uri, {useNewUrlParser: true});
var conn = mongoose.connection;

conn.on("connected", function(){
    console.log("Successfully connected to the Mongo DB.");
});

conn.on("disconnected", function(){
    console.log("Disconnected successfully");
});

conn.on("error", console.error.bind(console, 'connection error'));

module.exports = mongoose;