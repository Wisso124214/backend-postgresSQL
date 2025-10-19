import * as securityRoutes from './securityRoutes.js';

export default class Security {
  constructor(data = {}) {
    this.data = data;

    for (let route in securityRoutes) {
      this[route] = securityRoutes[route].bind(securityRoutes);
    }

    if (!Security.instance) {
      Security.instance = this;
    }
    return Security.instance;
  }
}
