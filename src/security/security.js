export default class Security {
  constructor(data = {}) {
    const {} = data;
    this.permissions = {};

    if (!Security.instance) {
      Security.instance = this;
    }
    return Security.instance;
  }

  // loadPermissions() {
  //   // Example method to fetch and map permissions
  // }
}
