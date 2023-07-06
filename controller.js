const db = require('./db');

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


db.query('SET time_zone = "Asia/Kolkata";', (err, results) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Time zone set to Asia/Kolkata');
});


db.query('SELECT @@session.time_zone;', (err, results) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Time zone of current database:', results[0]['@@session.time_zone']);
});

function getThisHourData(req, res) {
  const deviceId = req.params.deviceId;
  const query = `SELECT voltage_N, PF, kvah, kwh FROM Device_data_hour WHERE device_uid = '${deviceId}' ORDER BY datetime DESC LIMIT 1`; //hour

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
  const deviceId = req.params.deviceId;
  const query = `SELECT voltage_N, PF, kvah, kwh FROM Device_data_monthly where device_uid = '${deviceId}'  ORDER BY datetime DESC LIMIT 1`;//month_start
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
  const deviceId = req.params.deviceId;
  const query = `SELECT voltage_N, PF, kvah, kwh FROM Device_data_monthly where device_uid = '${deviceId}' ORDER BY datetime DESC LIMIT 2`;//month_start
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

function editDevice(req, res) {
  const deviceId = req.params.deviceId;
  const updatedDevice = req.body;
  const query = `UPDATE Dash_device SET device_name = '${updatedDevice.name}', location = '${updatedDevice.location}' WHERE device_uid = '${deviceId}'`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error updating device" });
    } else {
      res.json({ success: true });
    }
  });
}

// Get all Data -------------------------------------------------------------------------
function data(req, res) {
  const sql = 'SELECT * FROM energy_data';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get all Data todays -------------------------------------------------------------------------
function data_daily(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE DATE(timestamp) = CURDATE();';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get Data of 1 hour -------------------------------------------------------------------------
function data_hour(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR);';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get Data of 1 week -------------------------------------------------------------------------
function data_week(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get Data of 1 month -------------------------------------------------------------------------
function data_month(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get Data of 1 min -------------------------------------------------------------------------
function data_min(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Get Data of 1 year -------------------------------------------------------------------------
function data_year(req, res) {
  const sql = 'SELECT * FROM energy_data WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
  db.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
}

// Signup Function -------------------------------------------------------------------------
function signup(req, res) {
  const { company_name, company_admin_name, designation, company_email, contact_number, password } = req.body;
  
  // Fetch the last user ID from the database and increment it by 1
  const query = `SELECT userid FROM Dash_user ORDER BY userid DESC LIMIT 1;`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while fetching last user ID');
    } else {
      let lastUserId = result[0].userid;
      let lastUserIdNumber = parseInt(lastUserId.substring(5));
      let newUserIdNumber = lastUserIdNumber + 1;
      let newUserId = 'SENSE' + newUserIdNumber.toString().padStart(5, '0');
      
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error occurred while hashing the password');
        } else {
          // Insert user data into the database
          const query = `INSERT INTO Dash_user (userid,company_name, company_admin_name, designation, company_email, contact_number, password,created_at) VALUES (?, ?, ?, ?, ?, ?,?,?)`;
          const values = [newUserId, company_name, company_admin_name, designation, company_email, contact_number, hashedPassword, new Date()];
          db.query(query, values, (err, result) => {
            if (err) {
              console.error(err);
              res.json({ success: 0, message: 'Not able to register ' });
            } else {
              res.json({ success: 1, message: 'User Signed Up successfully' });
            }
          });
        }
      });
    }
  });
}

function login(req, res) {
  const { company_email, password } = req.body;

  try {
    // Retrieve user data from the database
    const query = 'SELECT * FROM Dash_user WHERE company_email = ?';
    db.query(query, company_email, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error occurred while retrieving user data');
      } else {
        if (result.length === 0) {
          res.json({ success: 0, message: 'Invalid credentials' });
        } else {
          const user = result[0];
          bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error occurred while comparing password');
            } else {
              if (passwordMatch) {
                const token = jwt.sign({ userid: user.userid }, 'mysecretkey');
                res.json({
                  success: 1,
                  token: token,
                  userData: user
                });
              } else {
                res.json({ success: 0, message: 'Invalid credentials' });
              }
            }
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while retrieving user data');
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: 0, message: 'Unauthorized access' });
  }
  jwt.verify(token, 'mysecretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ success: 0, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

function getUser(req, res) {
  const userId = req.user.userid;
  const query = 'SELECT * FROM Dash_user WHERE userid = ?';
  db.query(query, userId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while retrieving user data');
    } else {
      if (result.length === 0) {
        res.json({ success: 0, message: 'User not found' });
      } else {
        const user = result[0];
        res.json({
          success: 1,
          userData: user
        });
      }
    }
  });
}

function updateUser(req, res) {
  const userId = req.user.userid;
  const { company_name, company_admin_name, designation, contact_number, address } = req.body;
  
  const query = 'UPDATE Dash_user SET company_name = ?, company_admin_name = ?, designation = ?, contact_number = ?, address = ? WHERE userid = ?';
  const values = [company_name, company_admin_name, designation, contact_number, address, userId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while updating user data');
    } else {
      res.json({ success: 1, message: 'User data updated successfully' });
    }
  });
}

function updatePassword(req, res) {
  const userId = req.user.userid;
  const { current_password, new_password } = req.body;

  // Retrieve the hashed password from the database
  const query = 'SELECT password FROM Dash_user WHERE userid = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while updating password');
    } else if (result.length === 0) {
      res.status(404).json({ success: 0, message: 'User not found' });
    } else {
      const hashedCurrentPassword = result[0].password;

      if (!current_password || !hashedCurrentPassword) {
        res.status(400).json({ success: 0, message: 'Current password or hashed password is missing' });
      } else {
        // Compare the hashed version of the current password with the hashed password retrieved from the database
        bcrypt.compare(current_password, hashedCurrentPassword, (err, isMatch) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error occurred while updating password');
          } else if (!isMatch) {
            res.status(400).json({ success: 0, message: 'Current password is incorrect' });
          } else {
            // Hash the new password
            const hashedNewPassword = bcrypt.hashSync(new_password, 10);

            // Update the user's password in the database
            const updateQuery = 'UPDATE Dash_user SET password = ? WHERE userid = ?';
            db.query(updateQuery, [hashedNewPassword, userId], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error occurred while updating password');
              } else {
                res.json({ success: 1, message: 'Password updated successfully' });
              }
            });
          }
        });
      }
    }
  });
}





function forgotPassword(req, res) {
  const { company_email } = req.body;

  try {
    // Retrieve user data from the database
    const query = 'SELECT * FROM Dash_user WHERE company_email = ?';
    db.query(query, company_email, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error occurred while retrieving user data');
      } else {
        if (result.length === 0) {
          res.json({ success: 0, message: 'Invalid email address' });
        } else {
          const user = result[0];

          // Generate a random password
          const newPassword = Math.random().toString(36).slice(-8);

          // Update the user's password in the database
          const updateQuery = 'UPDATE Dash_user SET password = ? WHERE company_email = ?';
          const saltRounds = 10; 
          db.query(updateQuery, [bcrypt.hashSync(newPassword, saltRounds), company_email], (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error occurred while updating password');
            } else {
              // Send the new password to the user's email address
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'raotanmay97@gmail.com',
                  pass: 'hmgaqbvxmdkofdhn'
                }
              });
              const mailOptions = {
                from: 'raotanmay100@gmail.com',
                to: user.company_email,
                subject: 'Password Reset for Your Dashboard Account',
                text: `Your new password for your Dashboard account is: ${newPassword}`
              };
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.error(err);
                  res.status(500).send('Error occurred while sending email');
                } else {
                  res.json({ success: 1, message: 'New password sent to your email address' });
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while resetting password');
  }
}

// Function to get All energy data ------------------------------------------------
function allEnergyData(req, res) {
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

function getThisHourTotalData(req, res) {
  const userId = req.params.userId;
  const query = `SELECT 
  Dash_device.user_id,
  AVG(Device_data_hour.voltage_N) AS total_voltage_N,
  AVG(Device_data_hour.PF) AS total_PF,
  SUM(Device_data_hour.kvah) AS total_kvah,
  SUM(Device_data_hour.kwh) AS total_kwh
FROM 
  SalasarDB.Dash_device 
  INNER JOIN SalasarDB.Device_data_hour ON Dash_device.device_uid = Device_data_hour.device_uid
  INNER JOIN (
    SELECT device_uid, MAX(datetime) AS datetime
    FROM SalasarDB.Device_data_hour 
    GROUP BY device_uid
  ) AS latest_data ON Device_data_hour.device_uid = latest_data.device_uid AND Device_data_hour.datetime = latest_data.datetime
WHERE
  Dash_device.user_id = '${userId}'
GROUP BY
  Dash_device.user_id;`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving last hour data" });
    } else if (results.length === 0) {;
      res.status(404).json({ success: false, message: "No data found for user" });
    } else {
      const data = results[0];
      res.json(data);
    }
  });
}

function getThisMonthTotalData(req, res) {
  const userId = req.params.userId;
  const query = `SELECT 
  Dash_device.user_id,
  AVG(Device_data_monthly.voltage_N) AS total_voltage_N,
  AVG(Device_data_monthly.PF) AS total_PF,
  SUM(Device_data_monthly.kvah) AS total_kvah,
  SUM(Device_data_monthly.kwh) AS total_kwh
FROM 
  SalasarDB.Dash_device 
  INNER JOIN SalasarDB.Device_data_monthly ON Dash_device.device_uid = Device_data_monthly.device_uid
  INNER JOIN (
    SELECT device_uid, MAX(datetime) AS datetime
    FROM SalasarDB.Device_data_monthly 
    GROUP BY device_uid
  ) AS latest_data ON Device_data_monthly.device_uid = latest_data.device_uid AND Device_data_monthly.datetime = latest_data.datetime
WHERE
  Dash_device.user_id = '${userId}'
GROUP BY
  Dash_device.user_id;`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving this month data" });
    } else if (results.length === 0) {
      res.status(404).json({ success: false, message: "No data found for user" });
    } else {
      const data = results[0];
      res.json(data);
    }
  });
}

function getPrevMonthTotalData(req, res){
  const userId = req.params.userId;
  const query = `SELECT 
                  Dash_device.user_id,
                  AVG(Device_data_monthly.voltage_N) AS total_voltage_N,
                  AVG(Device_data_monthly.PF) AS total_PF,
                  SUM(Device_data_monthly.kvah) AS total_kvah,
                  SUM(Device_data_monthly.kwh) AS total_kwh
                FROM 
                  SalasarDB.Dash_device 
                  INNER JOIN SalasarDB.Device_data_monthly ON Dash_device.device_uid = Device_data_monthly.device_uid
                WHERE
                  Dash_device.user_id = '${userId}' AND
                  Device_data_monthly.datetime >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01') AND
                  Device_data_monthly.datetime < DATE_FORMAT(NOW(), '%Y-%m-01')
                GROUP BY
                  Dash_device.user_id;`;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving last month data" });
    } else if (results.length === 0) {
      res.status(404).json({ success: false, message: "No data found for user" });
    } else {
      const data = results[0];
      res.json(data);
    }
  });
}

// Define a GET endpoint to fetch all column names from a database table
// Example url: http://localhost:3000/device-data?columns=id,date,kwh,kvah,voltage_N,PF&device_uid=SL01202302&time_interval=last_year
function getColumns(req, res){
  const table = req.params.table;
  const sql = `SHOW COLUMNS FROM ${table}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    const columnNames = result.map(column => column.Field);
    res.send(columnNames);
  });
};

// function device_data(req, res) {
//   const { columns, device_uid, time_interval } = req.query;

//   // Enclose the device_uid parameter in quotes
//   let query = `SELECT ${columns} FROM Device_data_daily WHERE device_uid = '${device_uid}' AND date > `;

//   switch (time_interval) {
//     case 'last_year':
//       query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
//       break;
//     case 'last_month':
//       query += 'DATE_SUB(NOW(), INTERVAL 1 MONTH)';
//       break;
//     case 'last_week':
//       query += 'DATE_SUB(NOW(), INTERVAL 1 WEEK)';
//       break;
//     case 'last_day':
//       query += 'DATE_SUB(NOW(), INTERVAL 1 DAY)';
//       break;
//     case 'last_hour':
//       query += 'DATE_SUB(NOW(), INTERVAL 1 HOUR)';
//       break;
//     default:
//       return res.status(400).json({ error: 'Invalid time interval' });
//   }

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Server error' });
//     }

//     res.json(results);
//   });
// }


function device_data(req, res) {
  const { columns, device_uid, time_interval } = req.query;
  let table;

  switch (time_interval) {
    case 'last_year':
      table = 'Device_data_daily';
      break;
    case 'last_month':
      table = 'Device_data_monthly';
      break;
    case 'last_week':
      table = 'Device_data_weekly';
      break;
    case 'last_day':
      table = 'Device_data_daily';
      break;
    case 'last_hour':
      table = 'Device_data_hour';
      break;
    default:
      return res.status(400).json({ error: 'Invalid time interval' });
  }

  // Enclose the device_uid parameter in quotes
  let query = `SELECT ${columns} FROM ${table} WHERE device_uid = '${device_uid}' AND datetime > `;

  switch (time_interval) {
    case 'last_year':
      query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
    case 'last_month':
      query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
    case 'last_week':
      query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
    case 'last_day':
      query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
    case 'last_hour':
      query += 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(results);
  });
}

function getLiveDataForUser(req, res) {
  const userId = req.params.userId;
  const query = `
                SELECT u.userid, 'All' AS device_uid,
                   SUM(m.total_kwh) AS total_kwh,
                   SUM(m.total_kvah) AS total_kvah,
                   AVG(m.avg_pf) AS avg_pf,
                   AVG(m.avg_voltage) AS avg_voltage
                FROM (
                SELECT d.user_id, m.device_uid,
                       SUM(m.kwh) AS total_kwh,
                       SUM(m.kvah) AS total_kvah,
                       AVG(m.pf) AS avg_pf,
                       AVG(m.voltage_N) AS avg_voltage
                FROM SalasarDB.Device_data_minute AS m
                INNER JOIN (
                    SELECT device_uid, MAX(datetime) AS max_date_time
                    FROM SalasarDB.Device_data_minute
                    GROUP BY device_uid
                ) AS m2 ON m.device_uid = m2.device_uid AND m.datetime = m2.max_date_time
                INNER JOIN SalasarDB.Dash_device AS d ON m.device_uid = d.device_uid
                WHERE d.user_id = '${userId}'
                GROUP BY d.user_id, m.device_uid
                ) AS m
                INNER JOIN SalasarDB.Dash_user AS u ON m.user_id = u.userid
                WHERE u.userid = '${userId}'
                GROUP BY u.userid;`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error retrieving combined data" });
    } else if (results.length === 0) {
      res.status(404).json({ success: false, message: "No data found for user" });
    } else {
      const data = results[0];
      res.json(data);
    }
  });
}

/*function liveCharts(req, res, next) {
  const userId = req.params.userId;
  const parameter = "kwh"; // Change this to the desired parameter

  const query = `
    SELECT dd.device_uid, dd.${parameter}, dd.datetime, d.device_name
    FROM SalasarDB.Device_data_minute dd
    JOIN Dash_device d ON dd.device_uid = d.device_uid
    WHERE d.user_id = ? AND dd.datetime >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
    ORDER BY dd.datetime ASC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return next(err);
    }

    const entriesByDevice = {};
    results.forEach(entry => {
      if (!entriesByDevice[entry.device_uid]) {
        entriesByDevice[entry.device_uid] = {
          device_name: entry.device_name, // use the device_name property
          labels: [],
          data: [],
        };
      }
      entriesByDevice[entry.device_uid].labels.push(entry.datetime);
      entriesByDevice[entry.device_uid].data.push(entry[parameter]);
    });

    res.json(entriesByDevice);
  });
}*/
function liveCharts(req, res, next) {
  const userId = req.params.userId;
  const parameter = req.query.parameter || "kwh"; // Change this to the desired parameter or use the default value "kwh"

  const query = `
    SELECT dd.device_uid, dd.${parameter}, dd.datetime, d.device_name
    FROM SalasarDB.Device_data_minute dd
    JOIN Dash_device d ON dd.device_uid = d.device_uid
    WHERE d.user_id = ? AND dd.datetime >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)
    ORDER BY dd.datetime ASC;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return next(err);
    }

    const entriesByDevice = {};
    results.forEach(entry => {
      if (!entriesByDevice[entry.device_uid]) {
        entriesByDevice[entry.device_uid] = {
          device_name: entry.device_name,
          labels: [],
          data: [],
        };
      }
      entriesByDevice[entry.device_uid].labels.push(entry.datetime);
      entriesByDevice[entry.device_uid].data.push(entry[parameter]);
    });

    res.json(entriesByDevice);
  });
}

function fetchLastTenEntries(req, res) {
  const { columns, device_uid } = req.query;
  const query = `SELECT ${columns} FROM Device_data_hour WHERE device_uid = '${device_uid}' ORDER BY datetime DESC LIMIT 10`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(results);
  });
}


function getFilteredData(req, res){
  const filterMode = req.query.filterMode;
  const interval = req.query.interval;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const deviceUID = req.query.device_uid;
  const columns = req.query.columns;

  if (filterMode === 'Last') {
      const filteredData = getEnergyDataByLastInterval(interval, deviceUID, columns, res);
  } else if (filterMode === 'Interval') {
      const filteredData = getEnergyDataByInterval(startDate, endDate, deviceUID, columns, res);
  } else {
      res.status(400).json({ error: 'Invalid filter mode' });
  }
};


// Helper function for filtering energy data by the last interval
function getEnergyDataByLastInterval(interval, deviceUID, columns, res) {
  // Define the time offset for each interval option
  const intervalOptions = {
      // Interval options here
      '1s': 1 * 1000, // 1 second in milliseconds
      '5s': 5 * 1000, // 5 seconds in milliseconds
      '10s': 10 * 1000, // 10 seconds in milliseconds
      '15s': 15 * 1000, // 15 seconds in milliseconds
      '30s': 30 * 1000, // 30 seconds in milliseconds
      '1m': 1 * 60 * 1000, // 1 minute in milliseconds
      '2m': 2 * 60 * 1000, // 2 minutes in milliseconds
      '5m': 5 * 60 * 1000, // 5 minutes in milliseconds
      '10m': 10 * 60 * 1000, // 10 minutes in milliseconds
      '15m': 15 * 60 * 1000, // 15 minutes in milliseconds
      '30m': 30 * 60 * 1000, // 30 minutes in milliseconds
      '1h': 1 * 60 * 60 * 1000, // 1 hour in milliseconds
      '2h': 2 * 60 * 60 * 1000, // 2 hours in milliseconds
      '5h': 5 * 60 * 60 * 1000, // 5 hours in milliseconds
      '10h': 10 * 60 * 60 * 1000, // 10 hours in milliseconds
      '15h': 15 * 60 * 60 * 1000, // 15 hours in milliseconds
      '30h': 30 * 60 * 60 * 1000, // 30 hours in milliseconds
      '1d': 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      '7d': 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      '30d': 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
  };

  // Additional interval options for time duration
  const durationOptions = {
      // Duration options here
      'currentDay': {
          start: new Date().setHours(0, 0, 0, 0),
          end: new Date().setHours(23, 59, 59, 999)
      },
      'currentHour': {
          start: new Date().setMinutes(0, 0, 0),
          end: new Date().setMinutes(59, 59, 999)
      },
      'currentWeek': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 6, 23, 59, 59, 999)
      },
      'yesterday': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1).setHours(23, 59, 59, 999)
      },
      'dayBeforeYesterday': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2).setHours(23, 59, 59, 999)
      },
      'thisDayLastWeek': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).setHours(23, 59, 59, 999)
      },
      'previousWeekSunSat': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7 - new Date().getDay()).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7 - new Date().getDay() + 6, 23, 59, 59, 999)
      },
      'previousWeekMonSun': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7 - new Date().getDay() + 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7 - new Date().getDay() + 7, 23, 59, 59, 999)
      },
      'previousMonth': {
          start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59, 999)
      },
      'previousQuarter': {
          start: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 - 3, 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 0, 23, 59, 59, 999)
      },
      'previousHalfYear': {
          start: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 6) * 6 - 6, 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 6) * 6, 0, 23, 59, 59, 999)
      },
      'previousYear': {
          start: new Date(new Date().getFullYear() - 1, 0, 1).setHours(0, 0, 0, 0),
          end: new Date(new Date().getFullYear() - 1, 11, 31, 23, 59, 59, 999)
      }
  };

  if (intervalOptions.hasOwnProperty(interval)) {
      const currentTime = new Date();
      const timeOffset = intervalOptions[interval];
      const startTime = new Date(currentTime - timeOffset).toISOString();
      const endTime = currentTime.toISOString();

      // Execute the query to fetch energy data based on the time range
      const query = `SELECT ${columns} FROM Device_data_daily WHERE datetime BETWEEN ? AND ? AND device_uid = ?`;

      db.query(query, [startTime, endTime, deviceUID], (err, results) => {
          if (err) {
              console.error('Error executing the query:', err);
              return res.status(500).json({ error: 'Error executing the query' });
          }

          // Return the filtered energy data
          res.json(results);
      });
  } else if (durationOptions.hasOwnProperty(interval)) {
      // Handle duration options
      const { start, end } = durationOptions[interval];

      // Execute the query to fetch energy data based on the time range
      const query = `SELECT ${columns} FROM Device_data_daily WHERE datetime BETWEEN ? AND ? AND device_uid = ?`;

      db.query(query, [start, end, deviceUID], (err, results) => {
          if (err) {
              console.error('Error executing the query:', err);
              return res.status(500).json({ error: 'Error executing the query' });
          }

          // Return the filtered energy data
          res.json(results);
      });
  } else {
      return res.json({ error: 'Invalid interval' });
  }
}

// Helper function for filtering energy data by the selected interval
function getEnergyDataByInterval(startDate, endDate, deviceUID, columns, res) {
  // Implementation logic for filtering energy data by the selected interval
  // Execute the query to fetch energy data based on the specified start and end dates
  const query = `SELECT ${columns} FROM Device_data_daily WHERE datetime BETWEEN ? AND ? AND device_uid = ?`;

  db.query(query, [startDate, endDate, deviceUID], (err, results) => {
      if (err) {
          console.error('Error executing the query:', err);
          return res.status(500).json({ error: 'Error executing the query' });
      }

      // Return the filtered energy data
      res.json(results);
  });
}





module.exports = {
  getThisHourData,
  getThisMonthData,
  getPrevMonthData,
  getUserDevices,
  addDevice,
  deleteDevice,
  editDevice,
  data,
  data_daily,
  data_hour,
  data_week,
  data_month,
  data_min,
  data_year,
  signup,
  login,
  verifyToken,
  getUser,
  updateUser,
  updatePassword,  
  forgotPassword,
  allEnergyData,
  getThisHourTotalData,
  getThisMonthTotalData,
  getPrevMonthTotalData,
  getColumns,
  device_data,
  getLiveDataForUser,
  liveCharts,
  fetchLastTenEntries,
  getFilteredData
};
