import 'module-alias/register.js';
import { config } from '#root/config.js';
import app from '#src/middleware.js';
import { dbPoolDisconnection } from '#src/db.js';

import { createRoutes } from './src/routes.js';

const { PORT } = config;

(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})()
  .then(async () => {
    await createRoutes(app);
  })
  .catch((err) => {
    console.log('Error server listening ', err);
    dbPoolDisconnection();
  });

process.on('uncaughtException', (err) => {
  console.log(err);
  dbPoolDisconnection();
});
