const db = require('./db');

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



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
      res.json({ success: 0, message: 'Not able to register ' });
    } else {
      res.json({ success: 1, message: 'User Signed Up successfully' });
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
function users(req, res) {
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


// // Forgot Password Function
// async function forgotPassword(req, res) {
//   const { company_email } = req.body;

//   try {
//     // Retrieve user data from the database
//     const query = 'SELECT * FROM Dash_user WHERE company_email = ?';
//     db.query(query, company_email, async (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error occurred while retrieving user data');
//       } else {
//         if (result.length === 0) {
//           res.json({ success: 0, message: 'Invalid email address' });
//         } else {
//           const user = result[0];

//           // Send the existing password to the user's email address using nodemailer
//           const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'raotanmay97@gmail.com',
//               pass: 'hmgaqbvxmdkofdhn'
//             }
//           });
//           const mailOptions = {
//             from: 'raotanmay100@gmail.com',
//             to: user.company_email,
//             subject: 'Password Reminder for Your Dashboard Account',
//             text: `Your password for your Dashboard account is: ${user.password}`
//           };
//           transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//               console.error(err);
//               res.status(500).send('Error occurred while sending email');
//             } else {
//               res.json({ success: 1, message: 'Password sent to your email address' });
//             }
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error occurred while retrieving password');
//   }
// }
async function forgotPassword(req, res) {
  const { company_email } = req.body;

  try {
    // Retrieve user data from the database
    const query = 'SELECT * FROM Dash_user WHERE company_email = ?';
    db.query(query, company_email, async (err, result) => {
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
          db.query(updateQuery, [bcrypt.hashSync(newPassword, saltRounds), company_email], async (err, result) => {
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
