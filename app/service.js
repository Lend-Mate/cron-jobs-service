async function updateLastRunAt(client, jobName) {
  const result = await client.query(
    `UPDATE jobs SET last_run_at = NOW() WHERE name = $1 RETURNING *`,
    [jobName]
  );
  return result.rows;
}

async function getProductsByExpiredDateAndReason() {
  try {
    const currentDate = new Date().toISOString();
    const url = `${process.env.HOST_URL}/product-availability/internal/expired-rented`;
    const response = await fetch(url);

    // Check if the response status is 200-299
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('GET Data:', data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

async function convertPendingToConfirmed() {
  try {
    const url = `${process.env.HOST_URL}/orders/convert-pending-to-confirmed`;
    const response = await fetch(url);

    // Check if the response status is 200-299
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

async function convertConfirmedToDelivered() {
  try {
    console.log({env: process.env.HOST_URL})
    const url = `${process.env.HOST_URL}/orders/convert-confirmed-to-delivered`;
    const response = await fetch(url);

    // Check if the response status is 200-299
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

module.exports = {
  updateLastRunAt,
  getProductsByExpiredDateAndReason,
  convertPendingToConfirmed,
  convertConfirmedToDelivered
};