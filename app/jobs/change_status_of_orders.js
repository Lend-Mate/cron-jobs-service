require('dotenv').config();
const cron = require('node-cron');
const { updateLastRunAt, getProductsByExpiredDateAndReason, convertConfirmedToDelivered, convertPendingToConfirmed } = require('../service');

const JOB_NAME = 'change_status_of_orders';
const POLL_INTERVAL_MS = 10000;

async function fetchCronExpression(client) {
  const result = await client.query(
    `SELECT cron_expression FROM jobs WHERE name = $1 AND is_active = true`,
    [JOB_NAME]
  );

  return result.rows[0] && result.rows[0].cron_expression;
}

function createCronTask(cronExpression, client) {
  if (!cron.validate(cronExpression)) {
    throw new Error(`Invalid cron expression: ${cronExpression}`);
  }

  return cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log(`Cron fired for ${JOB_NAME} at ${new Date().toISOString()}`);
        await convertPendingToConfirmed();
        await convertConfirmedToDelivered();
        await updateLastRunAt(client, JOB_NAME);
      } catch (error) {
        console.error('Expired product availability cleanup error:', error);
      }
    },
    { noOverlap: true }
  );
}

async function startChangeStatusOfOrdersCron(client) {
  try {
    console.log('Starting change status of orders cron job....');
    let currentCronExpression = await fetchCronExpression(client);
    
    console.log(`Fetched cron expression for ${JOB_NAME}: ${currentCronExpression}`);
    if (!currentCronExpression) {
      throw new Error(`Cron expression for job ${JOB_NAME} not found.`);
    }

    let scheduledTask = createCronTask(currentCronExpression, client);

    setInterval(async () => {
      try {
        const latestCronExpression = await fetchCronExpression(client);

        if (!latestCronExpression) {
          console.warn(`Cron expression for job ${JOB_NAME} was removed from DB. Keeping existing schedule.`);
          scheduledTask.stop();
          currentCronExpression = null;
          return;
        }

        if (latestCronExpression !== currentCronExpression) {
          if (!cron.validate(latestCronExpression)) {
            console.error(`New cron expression is invalid: ${latestCronExpression}. Keeping existing schedule.`);
            return;
          }

          scheduledTask.stop();
          scheduledTask = createCronTask(latestCronExpression, client);
          currentCronExpression = latestCronExpression;
          console.log(`Rescheduled ${JOB_NAME} with new cron expression: ${currentCronExpression}`);
        }
      } catch (error) {
        console.error('Error reloading cron expression from DB:', error);
      }
    }, POLL_INTERVAL_MS);
  } catch (error) {
    console.error('Error starting expired product availability cleanup cron job:', error);

  }
}

module.exports = {
  startChangeStatusOfOrdersCron,
};
