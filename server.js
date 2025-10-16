import { SERVER_URL } from './config.js';

import app from './src/middleware.js';
import { dbConnection } from './src/db.js';

import { createControllers } from './src/controllers.js';
import { createRoutes } from './src/routes.js';

dbConnection(app)
  .then(async () => {
    await createControllers(app);
    await createRoutes(app);

  })
  .catch((err) => {
    console.log('Error connecting to db ', err);
  });

process.on('uncaughtException', (err) => {
  console.log(err);
});
