const express = require('express');
const app = express();
const router = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set CORS headers
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Use router
app.use(router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
