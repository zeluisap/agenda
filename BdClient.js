const { Client } = require("pg");

class BdClient {
  static async client() {
    if (this.clientObj) {
      return this.clientObj;
    }

    this.clientObj = new Client();
    await this.clientObj.connect();

    return this.clientObj;
  }
}

BdClient.clientObj = null;

module.exports = BdClient;
