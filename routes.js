const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/this-hour-data/:deviceId', controller.getThisHourData);

router.get('/this-month-data/:deviceId', controller.getThisMonthData);

router.get('/prev-month-data/:deviceId', controller.getPrevMonthData);

router.get('/user-devices/:userId', controller.getUserDevices);

router.post('/add-device', controller.addDevice);

router.delete('/delete-device/:deviceId', controller.deleteDevice);

router.put('/edit-device/:deviceId', controller.editDevice);

router.post('/signup', controller.signup);

router.post('/login', controller.login);

router.get('/user', controller.verifyToken, controller.getUser);

router.put('/user', controller.verifyToken, controller.updateUser);
// Update user password
router.put('/user/password', controller.verifyToken, controller.updatePassword);

router.get('/data',controller.data);

router.get('/data_daily',controller.data_daily);

router.get('/data_hour',controller.data_hour);

router.get('/data_week',controller.data_week);

router.get('/data_month',controller.data_month);

router.get('/data_min',controller.data_min);

router.get('/data_year',controller.data_year);

router.get('/energy-management-data',controller.allEnergyData);

router.post('/forgot-password',controller.forgotPassword);

router.get('/total-data-live-hour/:userId', controller.getThisHourTotalData);

router.get('/total-data-live-month/:userId', controller.getThisMonthTotalData);

router.get('/total-data-prev-month/:userId', controller.getPrevMonthTotalData);

router.get('/device-data',controller.device_data);

router.get('/columns/:table',controller.getColumns);

router.get('/live-data/:userId', controller.getLiveDataForUser);

router.get('/live-charts/:userId', controller.liveCharts)

router.get('/lastTenEntriesTable',controller.fetchLastTenEntries);

router.get('/filterData',controller.getFilteredData);

module.exports = router;