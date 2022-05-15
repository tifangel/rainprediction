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
    };

    const url = 'ws://192.168.0.113:8080/mqtt';
    const client = mqtt.connect(url, options);
    
    const topic = "rain"

    client.on('connect', () => {
        console.log('Connected');
        client.subscribe(topic, (err, granted) => {
            if (err) {
            console.log("Subscription request failed");
            }
        });
        client.subscribe("rain2", (err, granted) => {
            if (err) {
            console.log("Subscription request failed");
            }
        });
    });
    
    client.on("message", (topic, message, packet) => {
        const payload = JSON.parse(new TextDecoder("utf-8").decode(message));
        record.insertPayload(payload);
    });
    
    client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
    });
    
    client.on('reconnect', () => {
        console.log('Reconnecting');
    });
  
    app.get("/get-data/:city", record.getAll);
    app.post("/add-data", record.insertData);
    app.put("/update-status-roof/:city", async(req, res) => {
        await record.updateStatusRoof(req, res, () => {
            client.publish('roof', JSON.stringify({
                message: req.body.status === 'close' ? 'on' : 'off'
            }));
        });
    }); 
    app.get("/get-status-roof/:city", record.getStatusRoof); 
    app.get("/parse-csv", record.readDatacsv);
};