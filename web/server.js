const express = require('express'); // Express Module
const app = express(); // Express Instance

const port = process.env.PORT || 3000; // port number
const base = `${__dirname}/public`; // Website directory

// Specified middleware
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// route middleware for Pages Listed
app.get('/', function (req, res) {
    res.sendFile(`${base}/device-list.html`);
});
app.get('/register-device', function (req, res) {
    res.sendFile(`${base}/register-device.html`);
});
app.get('/send-command', function (req, res) {
    res.sendFile(`${base}/send-command.html`);
});
app.get('/about', function (req, res) {
    res.sendFile(`${base}/about-me.html`);
});
app.get('/registration', function (req, res) {
    res.sendFile(`${base}/registration.html`);
});
app.get('/login', function (req, res) {
    res.sendFile(`${base}/login.html`);
});

// route middleware for Page Error
app.get('*', function (req, res) {
    res.sendFile(`${base}/404.html`);
});

// server port listening
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});