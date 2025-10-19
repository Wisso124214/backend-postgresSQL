import 'module-alias/register.js';
import { SERVER_URL, config } from '#config/config.js';
import app from '#src/middleware.js';
import DB from '#src/db.js';
import Session from '#src/session/session.js';
import Security from '#src/security/security.js'; // Do not remove this line even if it seems unused

const { PORT } = config;

const db = new DB();
const session = new Session();
const security = new Security();

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${SERVER_URL}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})()
  .then(async () => {
    security.init();
    await session.init(app);
  })
  .catch((err) => {
    console.log('Error server listening ', err);
    db.dbPoolDisconnection();
  });

process.on('uncaughtException', (err) => {
  console.log(err);
  db.dbPoolDisconnection();
});
