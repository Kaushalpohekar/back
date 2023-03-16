// controller.js

const db = require('./db');

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');




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

// Get all Data -------------------------------------------------------------------------
function data(req, res){
  const sql = 'SELECT * FROM energy_data';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get all Data todays -------------------------------------------------------------------------
function data_daily(req, res){
  const sql = 'SELECT * FROM energy_data WHERE DATE(timestamp) = CURDATE();';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get Data of 1 hour -------------------------------------------------------------------------
function data_hour(req, res){
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR);';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get Data of 1 week -------------------------------------------------------------------------
function data_week(req, res){
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get Data of 1 month -------------------------------------------------------------------------
function data_month(req, res){
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get Data of 1 min -------------------------------------------------------------------------
function data_min(req, res){
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}
// Get Data of 1 year -------------------------------------------------------------------------
function data_year(req, res){
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Signup Function -------------------------------------------------------------------------
async function signup(req, res) {
  const { company_name, company_admin_name, designation, company_email, contact_number, password } = req.body;
  const userid = uuid.v4();


  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user data into the database
  const query = `INSERT INTO Dash_user (userid,company_name, company_admin_name, designation, company_email, contact_number, password,created_at) VALUES (?, ?, ?, ?, ?, ?,?,?)`;
  const values = [userid, company_name, company_admin_name, designation, company_email, contact_number, hashedPassword, new Date()];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while inserting user data');
    } else {
      res.status(200).send('User signed up successfully');
    }
  });
}

// Login Function Function -------------------------------------------------------------------------
async function login(req, res) {
  const { company_email, password } = req.body;

  try {
    // Retrieve user data from the database
    const query = 'SELECT * FROM Dash_user WHERE company_email = ?';
    db.query(query, company_email, async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error occurred while retrieving user data');
      } else {
        if (result.length === 0) {
          res.json({ success: 0, message: 'Invalid credentials' });
        } else {
          const user = result[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            const token = jwt.sign({ userid: user.userid }, 'mysecretkey');
            res.json({ success: 1, token: token });
          } else {
            res.json({ success: 0, message: 'Invalid credentials' });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while comparing password');
  }
}
//function to view all the users in the database -----------------------------------------------
function users(req, res){
  const query = `SELECT * FROM Dash_user`;
  db.query(query, (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error occurred while retrieving users');
      } else {
          res.status(200).json(results);
      }
  });
}


// Function to get All energy data ------------------------------------------------
function allEnergyData(req, res){
  const deviceId = req.query.device_id;
  const timeInterval = req.query.time_interval.toLowerCase();
  const columns = req.query.columns;

  let query;
  let params = [];

  switch (timeInterval) {
    case 'last_minute':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)`;
      params.push(deviceId);
      break;
    case 'last_hour':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)`;
      params.push(deviceId);
      break;
    case 'today':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND DATE(timestamp) = CURDATE()`;
      params.push(deviceId);
      break;
    case 'last_week':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 WEEK)`;
      params.push(deviceId);
      break;
    case 'last_month':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;
      params.push(deviceId);
      break;
    case 'last_year':
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR)`;
      params.push(deviceId);
      break;
    default:
      query = `SELECT ${columns} FROM energy_data WHERE device_id = ? AND timestamp = ?`;
      params.push(deviceId, timeInterval);
      break;
  }



  db.query(query, params, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Send the results back to the client
    console.log(query);
    res.send(results);
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
  signup,
  login,
  data,
  data_daily,
  data_hour,
  data_min,
  data_month,
  data_week,
  data_year,
  users,
  allEnergyData
};
