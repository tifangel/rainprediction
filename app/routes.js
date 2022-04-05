module.exports = app => {
    const record = require("./controller-mongoose.js");
    const mqtt = require('mqtt');

    const options = {
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false,
        username: 'admin',
        password: 'PTSKA123!',
    };

    // const url = "ws://36.94.223.75:9001/ws";
    const url = 'ws://192.168.27.71:8080/mqtt';
    const client = mqtt.connect(url, options);
    
    // const topic = 'powermeter/Power1';
    const topic = "rain"

    client.on('connect', () => {
        console.log('Connected');
        client.subscribe(topic, (err, granted) => {
            if (err) {
            console.log("Subscription request failed");
            }
        });
    });
    
    client.on("message", (topic, message, packet) => {
        const payload = JSON.parse(new TextDecoder("utf-8").decode(message));
        console.log(payload);
        const data = {
            humidity: payload.humidity,
            temperature: payload.temperature,
            pressure: payload.pressure,
            rainAnalog: payload.rainAnalog,
            rainDigital: payload.rainDigital
        }
        record.insertPayload(data);
    });
    
    client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
    });
    
    client.on('reconnect', () => {
        console.log('Reconnecting');
    });
  
    app.get("/get-data", record.getAll);
    app.post("/add-data", record.insertData); 
};