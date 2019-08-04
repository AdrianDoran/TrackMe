/**
* @api {get} /api/devices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
*   {
*       "_id": "dsohsdohsdofhsofhosfhsofh",
*       "name": "Mary's iPhone",
*       "user": "mary",
*       "sensorData": [
*       {
*           "ts": "1529542230",
*           "temp": 12,
*           "loc": {
*                   "lat": -37.84674,
*                   "lon": 145.115113
*           }
*       },
*         {
*           "ts": "1529572230",
*           "temp": 17,
*           "loc": {
*               "lat": -37.850026,
*               "lon": 145.117683
*           }
*          }
*       ]
*   }
* ]
* @apiErrorExample {json} Error-Response:
* {
*   "User does not exist"
* }
*/

const mongoose = require('mongoose');
module.exports = mongoose.model('Device', new mongoose.Schema({
    id: String,
    name: String,
    user: String,
    sensorData: Array
}));