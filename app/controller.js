const express = require('express');
const { getProductSample } = require('./service');

function createRoutes(client) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send('Hello World! Your Express server is running.');
  });

  return router;
}

module.exports = createRoutes;
