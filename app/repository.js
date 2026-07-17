const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'cron_jobs_service_db_dev',
  user: 'lendmate',
  password: 'lendmate',
});

async function connectDb() {
  try {
    await client.connect();
    console.log('Connected to cron job databases successfully.');
  } catch (error) {
    console.error('Error connecting to databases:', error);
    process.exit(1);
  }
}

module.exports = {
  client,
  connectDb,
};
