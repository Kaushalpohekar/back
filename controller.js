// controller.js

const db = require('./db');

function getLastHourDataKWH(req, res) {
  const query = "SELECT SUM(kwh) as total_kwh FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalHourKWH = results[0].total_kwh;
    res.json({ totalHourKWH });
  });
}

function getLastMonthDataKWH(req, res) {
  const query = "SELECT SUM(kwh) as total_kwh FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalMonthKWH = results[0].total_kwh;
    res.json({ totalMonthKWH });
  });
}

function getLastHourDataKVAH(req, res) {
  const query = "SELECT SUM(kvah) as total_kvah FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalHourKVAH = results[0].total_kvah;
    res.json({ totalHourKVAH });
  });
}

function getLastMonthDataKVAH(req, res) {
  const query = "SELECT SUM(kvah) as total_kvah FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalMonthKVAH = results[0].total_kvah;
    res.json({ totalMonthKVAH });
  });
}

function getLastHourDataPF(req, res) {
  const query = "SELECT AVG(pf) as avg_pf FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgHourPF = results[0].avg_pf;
    res.json({ avgHourPF });
  });
}

function getLastMonthDataPF(req, res) {
  const query = "SELECT AVG(pf) as avg_pf FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgMonthPF = results[0].avg_pf;
    res.json({ avgMonthPF });
  });
}

function getLastHourDataVoltage(req, res) {
  const query = "SELECT AVG(voltage_N) as avg_voltage FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgHourVoltage = results[0].avg_voltage;
    res.json({ avgHourVoltage });
  });
}

function getLastMonthDataVoltage(req, res) {
  const query = "SELECT AVG(voltage_N) as avg_voltage FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgMonthVoltage = results[0].avg_voltage;
    res.json({ avgMonthVoltage });
  });
}

module.exports = { 
  getLastHourDataKWH, 
  getLastMonthDataKWH, 
  getLastHourDataKVAH, 
  getLastMonthDataKVAH,
  getLastHourDataPF,
  getLastMonthDataPF,
  getLastHourDataVoltage,
  getLastMonthDataVoltage
};
