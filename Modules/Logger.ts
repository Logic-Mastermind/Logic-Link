export default class Logger {
  constructor(client) {
    this.client = client;
  }

  log(content, user) {
    try {
      const client = this.client;
      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (user.id == client.util.devId)) return "Developer Logs turned off.";
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) client.db.logs.set(logId, user.id, "user");
      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Log", "type");

      return Number(logId);
    } catch (error) {
      return error;
    }
  }

  warn(content, user) {
    try {
      const client = this.client;
      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (user.id == client.util.devId)) return "Developer Logs turned off.";
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) client.db.logs.set(logId, user.id, "user");
      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Warn", "type");

      return Number(logId);
    } catch (error) {
      return error;
    }
  }

  error(content, user) {
    try {
      const client = this.client;
      if (user) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (!canLog && (user.id == client.util.devId)) return "Developer Logs turned off.";
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      if (user) client.db.logs.set(logId, user.id, "user");
      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Error", "type");

      return Number(logId);
    } catch (error) {
      return error;
    }
  }

  updateLog(content, id) {
    try {
      const client = this.client;
      if (typeof id === "string") return;
      const count = client.db.logs.count;
      const data = client.db.logs.get(id);
      
      if (!data) return "No ID Provided";
      const logId = id ? id.toString() : (count + 1).toString();
      var details = data.details;

      if (!data.content) return "Invalid ID Provided";
      if (!details) details = [];
      details.push(content);

      client.db.logs.set(logId, details, "details");      
      return content;
    } catch (error) {
      return error;
    }
  }

  clear() {
    try {
      const client = this.client;
      client.db.logs.clear();
      client.db.devSettings.set(client.util.devId, Date.now(), "logsCleared");
      return null;
    } catch (error) {
      return error;
    }
  }
}