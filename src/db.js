import { pool } from '#root/config-db.js';

const dbClientConnection = async () =>
  await pool
    .connect()
    .then((cli) => {
      console.log(`Client connected to the database`);
      return cli;
    })
    .catch((err) => {
      console.error('Client database connection error', err.stack || err);
      process.exit(1);
    });

const dbClientDisconnection = (client) => {
  if (!client) {
    console.error('No client provided for disconnection');
    return;
  }

  try {
    client.release();
    console.log('Client database connection closed');
  } catch (err) {
    console.error('Error closing client database connection', err.stack || err);
  }
};

const dbPoolDisconnection = async () =>
  await pool
    .end()
    .then(() => console.log('Database pool has ended'))
    .catch((err) => {
      console.error('Error ending database pool', err.stack || err);
    });

const dbClientQuery = async (query, params = []) => {
  const client = await dbClientConnection();
  try {
    return await client.query(query, params);
  } catch (error) {
    console.error('Error executing query', error.stack || error);
  } finally {
    dbClientDisconnection(client);
  }
};

export {
  dbClientConnection,
  dbClientDisconnection,
  dbPoolDisconnection,
  dbClientQuery,
};
