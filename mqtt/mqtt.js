const mqtt = require('mqtt');
const mongoose = require('mongoose');
const Device = require('./models/device');
const express = require('express');
const bodyParser = require('body-parser');
const rand = require('random-int');
const randomCoordinates = require('random-coordinates');
const app = express();
const { URL, USERNAME, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect(URL, {
    username: USERNAME,
    password: PASSWORD
});

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);
        console.log(topic); // Debug Mode

        Device.findOne({ "name": data.deviceId }, (err, device) => {
            console.log(device) // Debug undefined
            if (err == true) {
                console.log(err)
            }
            const { sensorData } = device;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;
            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});

app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

// PUTS random data into the sensor-data for the device stoared in the database
app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", "); // Creates a random location to be saved
    const ts = new Date().getTime(); //Timestamp for location data
    const loc = { lat, lon }; // GPS Location
    const temp = rand(20, 50); // Gives a random temp between 20 and 50 degrees
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });

    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});