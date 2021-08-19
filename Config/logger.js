module.exports = class Logger {
  constructor(client) {
    this.client = client;
  }

  async log(content) {
    try {
      const logId = (this.client.db.logs.size + 1).toString();
      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Log", "type");

      return this.client.db.logs.get(logId);
    } catch (error) {
      return error
    }
  }

  async warn(content) {
    try {
      const logId = (this.client.db.logs.size + 1).toString();
      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Warn", "type");

      return this.client.db.logs.get(logId);
    } catch (error) {
      return error
    }
  }

  async error(content) {
    try {
      const logId = (this.client.db.logs.size + 1).toString();
      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Error", "type");

      return this.client.db.logs.get(logId);
    } catch (error) {
      return error
    }
  }

  async clear() {
    try {
      await this.client.db.logs.clear();
      await this.client.db.logs.set(this.client.util.devId, Date.now(), "clearedAt");
      return null
    } catch (error) {
      return error
    }
  }
}