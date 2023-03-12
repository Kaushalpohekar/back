const express = require('express');
const app = express();
const router = require('./routes');

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Use router
app.use(router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
