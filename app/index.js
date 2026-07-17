const express = require('express');
const { client, connectDb } = require('./repository');
const createRoutes = require('./controller');
const { startExpiredProductAvailabilityCron } = require('./jobs/expired_product_availability_cleanup');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', createRoutes(client));

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  startExpiredProductAvailabilityCron(client);
});
