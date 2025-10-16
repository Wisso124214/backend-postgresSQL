export const createSecurityRoutes = async (app) => {

  app.get('/', (req, res) => {
    res.send('API is running');
  });
};