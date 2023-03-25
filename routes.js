const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/this-hour-data', controller.getThisHourData);

router.get('/this-month-data', controller.getThisMonthData);

router.get('/prev-month-data', controller.getPrevMonthData);

router.get('/user-devices/:userId', controller.getUserDevices);

router.post('/add-device', controller.addDevice);

router.delete('/delete-device/:deviceId', controller.deleteDevice);

module.exports = router;