const Payload = require('./model-mongoose');
const Roof = require('./model-roof');
const axios = require('axios');

exports.getAll = (req,res) =>  {
	Payload.find({city: req.params.city}, function(err, result){
        if (err) {
            console.log(err);
            res.status(500).send({success: false, message: "Gagal mengambil data"});
        }else {
            var prediction = -1;
            if (result.length > 0) {
                const lastData = result[result.length - 1];
                axios.post('https://yuywl1w5o6.execute-api.ap-southeast-1.amazonaws.com/v1/predict', {
                    temperature: lastData.temperature, 
                    humidity: lastData.humidity, 
                    pressure: lastData.pressure
                })
                    .then(response => {
                        if (response?.data?.statusCode === 200) {
                            prediction = response?.data?.body ? 0 : 1;
                        } 
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            Roof.findOne({ city: req.params.city }, function(err, resultRoof){
                if(!err) {
                    res.status(200).send({data: result, prediction: prediction, statusroof: resultRoof.status, success: true, message: "Berhasil mengambil data"});
                } else {
                    res.status(200).send({data: result, prediction: prediction, statusroof: -1, success: true, message: "Berhasil mengambil data"});
                }
            });
        }
    })
};

exports.insertData = async(req,res) => {
	try{
        const payload = new Payload(
            {
                humidity: req.body.humidity,
                temperature: req.body.temperature,
                pressure: req.body.pressure,
                rainAnalog: req.body.rainAnalog,
                rainDigital: req.body.rainDigital
            }
        );
    
        const record = await payload.save();

        !record && res.status(404).send("Not Created");

        res.status(201).send("Has been created");
    } catch(err) {
        res.status(500).send("Error");
    }
};

exports.updateStatusRoof = async(req,res) => {
	try{
        console.log(req.params);
        Roof.updateOne({ city: req.params.city }, { status: req.body.status }, function(err, result) {
            if(err) {
                res.status(404).send("Update status roof failed");
            } else {
                res.status(201).send("Update status roof successful");
            }
        });
    } catch(err) {
        res.status(500).send("Update status roof failed");
    }
};

exports.getStatusRoof = async(req,res) => {
	Roof.findOne({ city: req.params.city }, function(err, result){
        if(err) {
            res.status(500).send({success: false, message: "Gagal mengambil data"});
        } else {
            res.status(200).send({data: result, success: true, message: "Berhasil mengambil data"});
        }
    });
};

exports.insertPayload = async(req) => {
	try{
        //mosquitto_pub -h "192.168.217.71" -p 1883 -t rain -m "{\"humidity\": 80, \"temperature\": 25, \"pressure\": 75365, \"rainAnalog\": 3724, \"rainDigital\": 0}"
        let date_ob = new Date();

        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();

        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        const currDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        console.log(currDate);
        const payload = new Payload(
            {
                date: currDate,
                humidity: req.humidity,
                temperature: req.temperature,
                pressure: req.pressure,
                rainAnalog: req.rainAnalog,
                rainDigital: req.rainDigital,
                city: "malang" //huruf kecil semua yaa
            }
        );
    
        const record = await payload.save();

        !record && console.log("Not Created");

        console.log("Has been created");
    } catch(err) {
        console.log("Error");
    }
};