export const createRoutes = async (app) => {
  app.get('/security', (req, res) => {
    res.send('Security API is running');
  });
};
