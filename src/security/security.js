import * as maintenance from './maintenance.js';
import DBMS from '#dbms/dbms.js';

const dbms = new DBMS();
export default class Security {
  constructor(data = {}) {
    const {} = data;
    this.permissions = {};

    if (!Security.instance) {
      Security.instance = this;
    }

    for (let method in maintenance) {
      if (method === 'default') continue; // Skip default export
      this[method] = maintenance[method].bind(maintenance);
    }
    return Security.instance;
  }

  init() {
    this.createMaintenance();
    this.bindMaintenanceMethods();
  }

  bindMaintenanceMethods() {
    for (let method in maintenance.default) {
      // console.log(`Binding maintenance method: ${method}`);
      this[method] = maintenance.default[method].bind(maintenance.default);
    }
  }

  loadPermissions() {
    // Example method to fetch and map permissions
  }
}
