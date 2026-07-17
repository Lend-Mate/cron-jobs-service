const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE || 'cron_jobs_service_db_dev',
  user: process.env.DB_USER || 'lendmate',
  password: process.env.DB_PASSWORD || 'lendmate',
});

async function connectDb() {
  try {
    await client.connect();
    console.log('Connected to cron job database successfully.');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

module.exports = {
  client,
  connectDb,
};
