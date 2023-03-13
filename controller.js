// controller.js

const db = require('./db');


// Total KWH of the last One Hour-------------------------------------------------------------------------
function getLastHourDataKWH(req, res) {
  const query = "SELECT SUM(kwh) as total_kwh FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalHourKWH = results[0].total_kwh;
    res.json({ totalHourKWH });
  });
}


// Total KWH of the last One Month-------------------------------------------------------------------------
function getLastMonthDataKWH(req, res) {
  const query = "SELECT SUM(kwh) as total_kwh FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalMonthKWH = results[0].total_kwh;
    res.json({ totalMonthKWH });
  });
}


// Total KVAH of the last One Hour-------------------------------------------------------------------------
function getLastHourDataKVAH(req, res) {
  const query = "SELECT SUM(kvah) as total_kvah FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalHourKVAH = results[0].total_kvah;
    res.json({ totalHourKVAH });
  });
}


// Total KVAH of the last One Month-------------------------------------------------------------------------
function getLastMonthDataKVAH(req, res) {
  const query = "SELECT SUM(kvah) as total_kvah FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalMonthKVAH = results[0].total_kvah;
    res.json({ totalMonthKVAH });
  });
}


// Average PF of the last One Hour-------------------------------------------------------------------------
function getLastHourDataPF(req, res) {
  const query = "SELECT AVG(pf) as avg_pf FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgHourPF = results[0].avg_pf;
    res.json({ avgHourPF });
  });
}


// Average PF of the last One Month-------------------------------------------------------------------------
function getLastMonthDataPF(req, res) {
  const query = "SELECT AVG(pf) as avg_pf FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgMonthPF = results[0].avg_pf;
    res.json({ avgMonthPF });
  });
}


// Average Voltage of the last One Hour-------------------------------------------------------------------------
function getLastHourDataVoltage(req, res) {
  const query = "SELECT AVG(voltage_N) as avg_voltage FROM SalasarDB.main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgHourVoltage = results[0].avg_voltage;
    res.json({ avgHourVoltage });
  });
}


// Average Voltage of the last One Month-------------------------------------------------------------------------
function getLastMonthDataVoltage(req, res) {
  const query = "SELECT AVG(voltage_N) as avg_voltage FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const avgMonthVoltage = results[0].avg_voltage;
    res.json({ avgMonthVoltage });
  });
}

// Total Data Point of last One hour KWH-------------------------------------------------------------------------
function getLastHourDataPointKWH(req, res) {
  const query = "SELECT SUM(kwh) as total_kwh, DATE_FORMAT(date_time, '%Y-%m-%d %H:%i') as time FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR) GROUP BY time ORDER BY time DESC LIMIT 60";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const totalHourPointKWH = results.reverse();
    res.json({ totalHourPointKWH });
  });
}

// Total Data Point of last One Month KWH-------------------------------------------------------------------------
function getLastMonthDataPointKWH(req, res) {
  const query = "SELECT DATE(date_time) as day, SUM(kwh) as total_kwh FROM main_database WHERE device_uid = 'SL01202302' AND date_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) GROUP BY day ORDER BY day DESC LIMIT 31";
  db.query(query, (error, results, fields) => {
    if (error) throw error;
    const monthlyDataPointKWH = results.reverse();
    res.json({ monthlyDataPointKWH });
  });
}

module.exports = { 
  //Signle Values for total Cards
  getLastHourDataKWH, 
  getLastMonthDataKWH, 
  getLastHourDataKVAH, 
  getLastMonthDataKVAH,
  getLastHourDataPF,
  getLastMonthDataPF,
  getLastHourDataVoltage,
  getLastMonthDataVoltage,

  //Multiple Values For Charts
  getLastHourDataPointKWH,
  getLastMonthDataPointKWH,
};
