let app;
try {
  app = require('../server/server');
} catch (err) {
  console.error('Error loading Express app in api/index.js:', err);
  const express = require('express');
  app = express();
  app.use(express.json());
  app.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Serverless initialization error',
      error: err.message,
      stack: err.stack
    });
  });
}

module.exports = app;
