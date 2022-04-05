const Payload = require('./model-mongoose');

exports.getAll = (req,res) =>  {
	Payload.find({}, function(err, result){
        if (err) {
            console.log(err);
            res.status(500).send({success: false, message: "Gagal mengambil data"});
        }else {
            res.status(200).send({data: result, success: true, message: "Berhasil mengambil data"});
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

exports.insertPayload = async(req) => {
	try{
        const payload = new Payload(
            {
                humidity: req.humidity,
                temperature: req.temperature,
                pressure: req.pressure,
                rainAnalog: req.rainAnalog,
                rainDigital: req.rainDigital,
                city: "Malang"
            }
        );
    
        const record = await payload.save();

        !record && console.log("Not Created");

        console.log("Has been created");
    } catch(err) {
        console.log("Error");
    }
};