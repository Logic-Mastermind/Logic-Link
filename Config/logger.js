module.exports = class Logger {
  constructor(client) {
    this.client = client;
  }

  async log(content) {
    try {
      const count = this.client.db.logs.count;
      const logId = (count + 1).toString();

      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Log", "type");

      return logId;
    } catch (error) {
      return error;
    }
  }

  async warn(content) {
    try {
      const count = this.client.db.logs.count;
      const logId = (count + 1).toString();

      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Warn", "type");

      return logId;
    } catch (error) {
      return error;
    }
  }

  async error(content) {
    try {
      const count = this.client.db.logs.count;
      const logId = (count + 1).toString();

      await this.client.db.logs.set(logId, Date.now(), "timestamp");
      await this.client.db.logs.set(logId, content, "content");
      await this.client.db.logs.set(logId, "Error", "type");

      return logId;
    } catch (error) {
      return error;
    }
  }

  async updateLog(content, id) {
    try {
      const count = await this.client.db.logs.count;
      const data = await this.client.db.logs.get(id);
      
      if (!data) return "No ID Provided";
      const logId = id ? id.toString() : (count + 1).toString();
      var details = data.details;

      if (!data.content) return "Invalid ID Provided";
      if (!details) details = [];
      details.push(content);

      await this.client.db.logs.set(logId, details, "details");      
      return content;
    } catch (error) {
      return error;
    }
  }

  async clear() {
    try {
      await this.client.db.logs.clear();
      await this.client.db.devSettings.set(this.client.util.devId, Date.now(), "logsCleared");
      return null
    } catch (error) {
      return error;
    }
  }
}