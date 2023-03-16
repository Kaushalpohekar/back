const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'salasardb1.cl4hxfnr1mxc.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin_123',
  database: 'SalasarDB'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database with ID:', connection.threadId);
});

module.exports = connection;


