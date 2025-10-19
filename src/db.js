import { pool } from '#root/config/config-db.js';

export default class DB {
  constructor() {
    this.pool = pool;

    if (!DB.instance) {
      DB.instance = this;
    }
    return DB.instance;
  }

  async dbClientConnection() {
    return await pool
      .connect()
      .then((cli) => cli)
      .catch((err) => {
        console.error('Client database connection error', err.stack || err);
        process.exit(1);
      });
  }

  dbClientDisconnection(client) {
    if (!client) {
      console.error('No client provided for disconnection');
      return;
    }

    try {
      client.release();
    } catch (err) {
      console.error(
        'Error closing client database connection',
        err.stack || err
      );
    }
  }

  async dbPoolDisconnection() {
    return await pool
      .end()
      .then(() => console.log('Database pool has ended'))
      .catch((err) => {
        console.error('Error ending database pool', err.stack || err);
      });
  }

  async dbClientQuery(query, params = []) {
    const client = await this.dbClientConnection();
    try {
      return await client.query(query, params);
    } catch (error) {
      console.error('Error executing query', error.stack || error);
    } finally {
      this.dbClientDisconnection(client);
    }
  }
}
