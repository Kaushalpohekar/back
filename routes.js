const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/KWH-last-hour', controller.getLastHourDataKWH);

router.get('/KWH-last-month', controller.getLastMonthDataKWH);

router.get('/KVAH-last-hour', controller.getLastHourDataKVAH);

router.get('/KVAH-last-month', controller.getLastMonthDataKVAH);

router.get('/PF-last-hour', controller.getLastHourDataPF);

router.get('/PF-last-month', controller.getLastMonthDataPF);

router.get('/Voltage-last-hour', controller.getLastHourDataVoltage);

router.get('/Voltage-last-month', controller.getLastMonthDataVoltage);

router.get('/KWH-last-hour-points', controller.getLastHourDataPointKWH);

router.get('/KWH-last-month-points', controller.getLastMonthDataPointKWH);

router.post('/signup', controller.signup);

router.post('/login', controller.login);

router.get('/data',controller.data);

router.get('/data_daily',controller.data_daily);

router.get('/data_hour',controller.data_hour);

router.get('/data_week',controller.data_week);

router.get('/data_month',controller.data_month);

router.get('/data_min',controller.data_min);

router.get('/data_year',controller.data_year);

router.get('/users',controller.users);

router.get('/energy-management-data',controller.allEnergyData);

router.post('/forgot-password',controller.forgotPassword);

module.exports = router;