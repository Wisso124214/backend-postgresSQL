import 'module-alias/register.js';
import { SERVER_URL, config } from '#root/config.js';
import app from '#src/middleware.js';
import DB from '#src/db.js';
import Router from '#src/router.js';

const { PORT } = config;

const db = new DB();
const router = new Router(app);

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
    await router.createRoutes();
  })
  .catch((err) => {
    console.log('Error server listening ', err);
    db.dbPoolDisconnection();
  });

process.on('uncaughtException', (err) => {
  console.log(err);
  db.dbPoolDisconnection();
});
