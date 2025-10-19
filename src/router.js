import Session from '#src/session/session.js';
import Security from '#src/security/security.js';

const session = new Session();
const security = new Security();

export default class Router {
  constructor(app) {
    this.app = app;

    app.get('/', (req, res) => {
      res.send('API is running');
    });

    if (!Router.instance) {
      Router.instance = this;
    }
    return Router.instance;
  }

  async createRoutes() {
    await session.createRoutes(this.app);
    await security.createRoutes(this.app);
  }
}
