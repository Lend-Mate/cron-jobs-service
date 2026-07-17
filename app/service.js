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
    const url = 'http://178.104.91.123/api/product-availability/internal/expired-rented';
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

module.exports = {
  updateLastRunAt,
  getProductsByExpiredDateAndReason
};