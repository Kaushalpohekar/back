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


module.exports = router;