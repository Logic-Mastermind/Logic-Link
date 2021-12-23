import Discord from "discord.js";
import client from "../index";

/**
 * A class with methods used to save log data to the database.
 * @class Logger
 */
export default class Logger {
  client: Discord.Client;

  /**
   * Used to set the client property if it still exists.
   * @constructor
   * @param {Discord.Client} [client] - The client.
   */
  constructor(client?: Discord.Client) {
    if (client) this.client = client;
  }

  /**
   * Saves a log to the database.
   * @function log
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number|void} The ID of the log that was created.
   */
  log(content: string, userId?: Discord.User | string): number | void {
    try {
      if (userId) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (userId instanceof Discord.User) userId = userId.id;
        if (!canLog && (userId === client.util.devId)) return;

        client.db.logs.set(logId, userId, "user");
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Log", "type");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
    }
  }

  /**
   * Saves a warning log to the database.
   * @function warn
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number|void} The ID of the warning log that was created.
   */
   warn(content: string, userId?: Discord.User | string): number | void {
    try {
      if (userId) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (userId instanceof Discord.User) userId = userId.id;
        if (!canLog && (userId === client.util.devId)) return;

        client.db.logs.set(logId, userId, "user");
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Warn", "type");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
    }
  }

  /**
   * Saves an error log to the database.
   * @function error
   * @param {string} content - The content of the log.
   * @param {Discord.User|string} [user] - The user who emitted this log.
   * @returns {number|void} The ID of the log that was created.
   */
   error(content: string, userId?: Discord.User | string): number | void {
    try {
      if (userId) {
        const canLog = client.db.devSettings.get(client.util.devId, "allowLog");
        if (userId instanceof Discord.User) userId = userId.id;
        if (!canLog && (userId === client.util.devId)) return;

        client.db.logs.set(logId, userId, "user");
      }

      const count = client.db.logs.count;
      const logId = (count + 1).toString();

      client.db.logs.set(logId, Date.now(), "timestamp");
      client.db.logs.set(logId, content, "content");
      client.db.logs.set(logId, "Error", "type");

      return Number(logId);
    } catch (error) {
      client.functions.sendError(error);
    }
  }

  /**
   * Updates a log with further details.
   * @function updateLog
   * @param {string} content - The content of the update.
   * @param {string|number} id - The ID of the log to update.
   * @returns {string[]|void} All of the updates to the log.
   */
  updateLog(content: string, id: string | number): string[] | void {
    try {
      if (typeof id === "number") id.toString();
      const count = client.db.logs.count;
      const data = client.db.logs.get(id);

      const details = data.details || [];
      details.push(content);

      client.db.logs.set(id, details, "details");      
      return details;

    } catch (error) {
      client.functions.sendError(error);
    }
  }

  /**
   * Clears all logs from the database.
   * @function clear
   * @returns {boolean|void} Whether the operation succeeded or not.
   */
  clear(): boolean | void {
    try {
      client.db.logs.clear();
      client.db.devSettings.set(client.util.devId, Date.now(), "logsCleared");
      return true;

    } catch (error) {
      client.functions.sendError(error);
    }
  }
}