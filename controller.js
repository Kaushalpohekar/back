const db = require('./db');

function getThisHourData(req, res) {
  const query = "SELECT voltage_N, PF, kvah, kwh FROM Device_data_hour where device_uid = 'SL01202302' ORDER BY hour DESC LIMIT 1";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving last hour data" });
    } else {
      const avgHourVoltage = results[0].voltage_N;
      const avgHourPF = results[0].PF;
      const totalHourKVAH = results[0].kvah;
      const totalHourKWH = results[0].kwh;
      res.json({ avgHourVoltage, avgHourPF, totalHourKVAH, totalHourKWH });
    }
  });
}

function getThisMonthData(req, res) {
  const query = "SELECT voltage_N, PF, kvah, kwh FROM Device_data_monthly where device_uid = 'SL01202302' ORDER BY month_start DESC LIMIT 1";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving last month data" });
    } else {
      const avgMonthVoltage = results[0].voltage_N;
      const avgMonthPF = results[0].PF;
      const totalMonthKVAH = results[0].kvah;
      const totalMonthKWH = results[0].kwh;
      res.json({ avgMonthVoltage, avgMonthPF, totalMonthKVAH, totalMonthKWH });
    }
  });
}

function getPrevMonthData(req, res) {
  const query = "SELECT voltage_N, PF, kvah, kwh FROM Device_data_monthly where device_uid = 'SL01202302' ORDER BY month_start DESC LIMIT 2";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving previous Month data" });
    } else {
      const prevMonthVoltage = results[1].voltage_N;
      const prevMonthPF = results[1].PF;
      const totalPrevMonthKVAH = results[1].kvah;
      const totalPrevMonthKWH = results[1].kwh;
      res.json({ prevMonthVoltage, prevMonthPF, totalPrevMonthKVAH, totalPrevMonthKWH });
    }
  });
}

function getUserDevices(req, res) {
  const userId = req.params.userId;
  const query = `SELECT * FROM Dash_device WHERE user_id = '${userId}'`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving user devices" });
    } else {
      res.json(results);
    }
  });
}

function addDevice(req, res) {
  const device = req.body;
  const queryCheck = `SELECT * FROM Dash_device WHERE device_uid = '${device.deviceId}'`;
  db.query(queryCheck, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error checking device availability" });
    } else {
      if (results.length > 0) {
        res.status(400).json({ success: false, message: "Device already exists" });
      } else {
        const queryAdd = `INSERT INTO Dash_device (user_id, device_name, device_uid, company_name, location) VALUES ('${device.userId}', '${device.deviceName}', '${device.deviceId}', '${device.companyName}', '${device.location}')`;
        db.query(queryAdd, (error, results, fields) => {
          if (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Error adding device" });
          } else {
            res.json({ success: true, message: "Device successfully added" });
          }
        });
      }
    }
  });
}

function deleteDevice(req, res) {
  const deviceId = req.params.deviceId;
  const query = `DELETE FROM Dash_device WHERE device_uid = '${deviceId}'`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error deleting device" });
    } else {
      res.json({ success: true });
    }
  });
}

module.exports = { 
  //Signle Values for total Cards
  getThisHourData,
  getThisMonthData,
  getPrevMonthData,
  getUserDevices,
  addDevice,
  deleteDevice
};
