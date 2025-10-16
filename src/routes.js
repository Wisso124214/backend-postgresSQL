import { createSessionRoutes } from './session/sessionRoutes.js';
import { createSecurityRoutes } from './security/securityRoutes.js';

export const createRoutes = async (app) => {
  await createSessionRoutes(app);
  await createSecurityRoutes(app);

  app.get('/', (req, res) => {
    res.send('API is running');
  });
};