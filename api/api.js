const mongoose = require('mongoose');
const Device = require('./models/device')
const User = require('./models/user');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser : true });

/**
 * @api {use} /api/api.js Headers
 * @apiGroup Server
 * @apiDescription For Cross-origin Access Control requests
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "Access-Control-Allow-Origin"
 *  "Access-Control-Allow-Headers"
 *  "Origin, X-Requested-With, Content - Type, Accept"
 * }
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content - Type, Accept");
    next();
});

/**
 * @api {use} /api/public/ Specifies File location
 * @apiGroup Public
 * @apiDescription This is the specified location for files to be retreived or stored
 */
app.use(express.static(`${__dirname}/public`));

/**
 * @api {get} /public/generated-docs/index.html Api Document if created.
 * @apiGroup Docs
 * @apiDescription Location and name of the Api Doc named Index
 */
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

/**
 * @api {get} /api/devices All Devices in the array
 * @apiGroup Device
 * 
 * @apiSuccess {Array[]} Devices List of all devices
 * @apiError {String} Error No Devices found
 */
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        return err
        ? res.send(err)
        : res.send(devices);
    });
});

/**
 * @api {get} /api/test Test page
 * @apiGroup Test
 * 
 * @apiDescription Test page to see if API is working
 */
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});

/**
 * @api {get} /api/devices/:deviceId/device-history Finds the history of the selected device
 * @apiGroup Device
 * 
 * @apiParam {String} deviceId Information about selected device
 * @apiSuccess {Array[]} sensorData List of recorded sensor data
 * @apiError {String} Error No History for device
 */
app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({ "_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});

/**
 * @api {get} /api/users/:user/devices Finds devices relevent to the User
 * @apiGroup User
 * 
 * @apiParam {Array[]} user Required to select correct information
 * @apiSuccess {List[]} devices Displays information that correlates to the User's Profile
 * @apiError {String} Error No Devices match User Profile
 */
app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});

/**
 * @api {listen} /app/server Server Port
 * @apiGroup Server
 * @apiDescription Listens to the Server on specified port
 */
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

/**
 * @api {post} /api/devices Saves new device information
 * @apiGroup Device
 * 
 * @apiSuccess {Array[]} newDevice Adds new device information to the Array
 * @apiSuccess {String} Message Returns a message for completion
 * @apiError {String} Error New Device cannot be saved
 */
app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
        ? res.send(err)
        : res.send('Successfully added Device and Data!!');
    });
});

/**
 * @api {post} /api/authenticate Login Authentication Check
 * @apiGroup Login
 * 
 * @apiParam {String} name User Input from web page
 * @apiParam {String} password User Input from web page
 * @apiSuccess {Boolean} Success Returns a true/false statement for success
 * @apiSuccess {Boolean} Administrator Returns a value if the user is an admin
 * @apiSuccess {String} Message Returns a statement that it was successful
 * @apiError {String} Message Returns a statement that the User does not exist
 * @apiError {String} Message Returns a statement that the Password does not match
 */
app.post('/api/authenticate', (req, res) => {
    const { name, password } = req.body;
    User.findOne({'name': name}, (err, user) => {
        console.log(user); // Debug to console
        console.log(req.body); // Debug to console
        console.log(name, password); // Debug to console
            if (err == true){
                console.log('Auth error');
                return res.send(err);
            }
            if (user == null || user.name != name)
            {
                console.log('user error'); // Debug to console
                return res.send('Username does not exist in our records!');
            }
            if (user.password != password)
            {
                console.log('Password error'); // Debug to console
                return res.send('Password does not match our records!! Please try again!!');
            }
            else {
                return res.json({
                    success: true,
                    message: 'Authenticated successfully',
                    isAdmin: user.isAdmin
                });
            }
        })
});

/**
 * @api {post} /api/registration Creates a new User Account
 * @apiGroup Registration
 * 
 * @apiParam {String} name User Input from web page
 * @apiParam {String} password User Input from web page
 * @apiParam {Number} isAdmin Specifies if New user is an administrator
 * @apiSuccess {Array[]} newUser Creates and new account
 * @apiSuccess {Function} newUser.save Adds new user to the database
 * @apiSuccess {Boolean} Success Returns a true/false statement for success
 * @apiSuccess {String} Message Returns a statement that new user has been created
 * @apiError {String} Message Returns a statement that the User already exists.
 */
app.post('/api/registration', (req, res) => {
    const { name, password, isAdmin} = req.body;
    User.findOne({'name': name}, (err, user) => {
        console.log(user);
        console.log(name, password);
        if (err == true) {
            return res.send(err);
        }
        if (user.name == name)
        {
            console.log('user found!!'); // Debug to console
            return res.send('Username already exists in our records, Please sign in!!');
        }
        else
        {
            const newUser = new User({
                name,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    })
})

/** OLD CODE
 * @api {post} /api/send-command Send a Command
 * @apiGroup Command
 * @apiDescription Sends a command to Console
 */
// app.post('/api/send-command', (req, res) => {
//     console.log(req.body);
// });