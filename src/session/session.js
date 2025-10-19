import * as sessionManager from './sessionManager.js';
import * as sessionRoutes from './sessionRoutes.js';

export default class Session {
  constructor(data = {}) {
    this.data = data;

    for (let method in sessionManager) {
      this[method] = sessionManager[method].bind(sessionManager);
    }

    for (let route in sessionRoutes) {
      this[route] = sessionRoutes[route].bind(sessionRoutes);
    }

    if (!Session.instance) {
      Session.instance = this;
    }
    return Session.instance;
  }
}
