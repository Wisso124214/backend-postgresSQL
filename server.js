import 'module-alias/register.js';
import { SERVER_URL, config } from '#config/config.js';
import app from '#src/middleware.js';
import DBMS from '#dbms/dbms.js';
import Session from '#src/session/session.js';
import Security from '#src/security/security.js';

const { PORT } = config;

const dbms = new DBMS();
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
    await session.init(app);
    dbms.init();
    // console.log('dbms: ', dbms.getThis());
    // console.log('dbms methods:', dbms.getAllDinamicMethodNames());
    // console.log('session methods:', session.getAllDinamicMethodNames());
  })
  .catch((err) => {
    console.log('Error server listening ', err);
    dbms.poolDisconnection();
  });

process.on('uncaughtException', (err) => {
  console.log(err);
  dbms.poolDisconnection();
});
