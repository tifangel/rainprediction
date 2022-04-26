const Payload = require('./model-mongoose');
const Roof = require('./model-roof');
const axios = require('axios');
const fs = require('fs');
const csv = require('@fast-csv/parse');

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
                            Roof.findOne({ city: req.params.city }, function(err, resultRoof){
                                if(!err) {
                                    res.status(200).send({data: result, prediction: prediction, statusroof: resultRoof.status, success: true, message: "Berhasil mengambil data"});
                                } else {
                                    res.status(200).send({data: result, prediction: prediction, statusroof: -1, success: true, message: "Berhasil mengambil data"});
                                }
                            });
                        } 
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(200).send({data: result, prediction: prediction, statusroof: -1, success: true, message: "Berhasil mengambil data"});
                    });
            } else {
                Roof.findOne({ city: req.params.city }, function(err, resultRoof){
                    if(!err) {
                        res.status(200).send({data: result, prediction: prediction, statusroof: resultRoof.status, success: true, message: "Berhasil mengambil data"});
                    } else {
                        res.status(200).send({data: result, prediction: prediction, statusroof: -1, success: true, message: "Berhasil mengambil data"});
                    }
                });
            }
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

exports.updateStatusRoof = async(req,res, callback) => {
	try{
        Roof.updateOne({ city: req.params.city }, { status: req.body.status }, function(err, result) {
            if(err) {
                res.status(404).send({message: "Update status roof failed"});
            } else {
                try{
                    callback();
                    res.status(201).send({message: "Update status roof successful"});
                } catch(err) {
                    res.status(404).send({message: "Update status roof failed"});
                }
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

convertDatetoString = (textDate) => {
    let date_ob;
    if (textDate) {
        date_ob = new Date(textDate);
    } else {
        date_ob = new Date();
    }

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const currDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return currDate;
}

exports.insertPayload = async(req) => {
	try{
        //mosquitto_pub -h "192.168.217.71" -p 1883 -t rain -m "{\"humidity\": 80, \"temperature\": 25, \"pressure\": 75365, \"rainAnalog\": 3724, \"rainDigital\": 0, \"roof\": \"close\", \"city\":\"malang\"}"
        const currDate = convertDatetoString();
        
        const payload = new Payload(
            {
                date: currDate,
                humidity: req.humidity,
                temperature: req.temperature,
                pressure: req.pressure,
                rainAnalog: req.rainAnalog,
                rainDigital: req.rainDigital,
                city: req.city
            }
        );

        const record = await payload.save();
        !record ? console.log("Not Created") : console.log("Has been created");

        Roof.updateOne({ city: req.city }, { status: req.roof }, function(err, result) {
            if(err) {
                console.log("Update status roof failed");
            } else {
                console.log("Update status roof successful");
            }
        });
    } catch(err) {
        console.log("Error");
    }
};

exports.readDatacsv = async(req, res) => {
    const stream = fs.createReadStream('../data/Malang-19-04.csv');
    var data = [];
    csv.parseStream(stream, {delimiter: ",", headers: true})
        .on('error', error => {
            console.error(error);
            res.status(404).send({message: "Failed Read csv"});
        })
        // .on('data', row => console.log(`ROW=${JSON.stringify(row)}`))
        .on('data', row => {
            const currDate = convertDatetoString(row['timestamp']);
            data.push({
                date: currDate,
                humidity: Number(row['humidity']),
                temperature: Number(row['temperature']),
                pressure: Number(row['pressure']),
                rainAnalog: Number(row['rainAnalog']),
                rainDigital: Number(row['rainDigital']),
                city: "malang"
            });
        })
        .on('end', rowCount => {
            console.log(`Parsed ${rowCount} rows`);
            // res.status(200).send({data: data, message: "Read csv"});
            try{
                data.forEach((value) => {
                    const payload = new Payload(value);
                
                    payload.save();
                });
        
                console.log("Has been created");
                res.status(200).send({data: data, message: "Read csv"});
            } catch(err) {
                console.log("Error");
                res.status(404).send({message: "Failed Read csv"});
            }
        });
}